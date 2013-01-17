/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true */

(function () {
  "use strict";

  var _ = X._,
    exec = require('child_process').exec,
    url = require("url"),
    querystring = require("querystring"),
    path = require('path');

  /**
    Runs extension init scripts and installs extension orms
    for organizations with the extensions activated. Saves
    a bunch of manual script running whenever an extension
    is updated or when an organization adds a new extension.

    @extends X.Route
    @class
   */
  X.maintenanceRoute = X.Route.create({

    error: function (session, xtr) {
      var response = xtr.get("response"),
        err = session.get("error");

      if (!err || typeof err !== 'string') {
        // just please keep the datasource from crashing
        err = "Error 12933";
      }
      //X.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(err);
      response.end();
      //xtr.error({isError: true, reason: session.get("error")});
    },

    handle: function (xtr) {
      var that = this,
        originalUrl = xtr.get("url"),
        cookie = xtr.request.cookies ? xtr.request.cookies.xtsessioncookie : undefined,
        session,
        sessionParams,
        response = xtr.get("response"),
        args = querystring.parse(url.parse(originalUrl).query);

      if (xtr.get("host") === "localhost:442") {
        // users accessing this route through the unexposed server don't have to
        // get authenticated. Do the fetch under the node user authority.
        this.install(xtr, args, X.options.globalDatabase.nodeUsername);
        return;
      }

      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      sessionParams = JSON.parse(cookie);
      if (!sessionParams.sid) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      session = X.Session.create(sessionParams);

      session.once("error", _.bind(this.error, this, session, xtr));

      session.once("isReady", function () {
        // because the session is loaded, session.id is the global username
        that.install(xtr, args, session.id);

      });
    },

    /**
      This is the function that does all the work. It can be run after a successful
      session load, or through the localhost backdoor.
     */
    install: function (xtr, args, username) {
      var that = this,
        commandCount = 0,
        commandsReturned = 0,
        ormCount = 0,
        ormsReturned = 0,
        resp = {commandLog: [], log: [], errorLog: [], errorCount: 0},
        organizationColl = new XM.OrganizationCollection(),
        //
        // practically all the code is in the success callback of the initial fetch
        // on the organization collection
        //
        fetchSuccess = function (collection, response) {
          _.each(collection.models, function (org) {
            // XXX We ensure that users have ViewOrganizations privileges. It would be better
            // to ensure that they also have MaintainOrganizations priviliges, but there
            // is no way to ensure this from the model layer because model.canUpdate() refers
            // to the node authority in this context, which is omnipotence.

            X.log("Running scripts for organization: ", org.get("name"));
            _.each(org.get("extensions").models, function (ext) {
              //
              // go through all of the extensions of all the organizations...
              //
              if (args.extensions && JSON.parse(args.extensions).indexOf(ext.get("extension").id) < 0) {
                // if the user has specified that only some extensions are to be loaded,
                // then we stop here if this extension at hand is not on that list
                return;
              }
              X.log("Running scripts for extension: ", ext.get("extension").get("name") + " id: " + ext.get("extension").get("id"));

              var extLoc = ext.get("extension").get("location"),
                extName = ext.get("extension").get("name"),
                scriptDir = ".." + extLoc + "/source/" + extName + "/database/source",
                ormDir = ".." + extLoc + "/source/" + extName + "/database/orm",
                // XXX use fs.existsSync in node 0.8 instead of path.existsSync
                ormsExist = path.existsSync(ormDir),
                scriptName = "init_script.sql",
                host = org.get("databaseServer").get("hostname"),
                port = org.get("databaseServer").get("port"),
                orgName = org.get("name"),
                flags = "-h " + host + " -p " + port + " -d " + orgName + " -f " + scriptName + "\n",
                psqlPath = X.options.datasource.psqlPath || "psql",
                nodePath = X.options.datasource.nodePath || "node",
                pgUser = org.get("databaseServer").get("user"),
                pgPassword = org.get("databaseServer").get("password"),
                // XXX could we avoid using pgpass by putting the pgPassword into the command here?
                psqlCommand = psqlPath + " -U " + pgUser + " " + flags,
                scriptCallback = function (error, stdout, stderr) {
                  // in the callback of the init script we will then run the orm installer if
                  // applicable

                  // note that we leave out the password from the command because it will
                  // be reported back to the user
                  var ormCommand = nodePath + " installer.js -cli -h " + host + " -d " + orgName +
                      " -u " + pgUser + " -p " + port + " --path ../../../" + ormDir + " -P ",
                    // the installer (the orm repo, actually) is an npm-managed dependency
                    // in node-datasource
                    installerDir = "node_modules/orm/installer",
                    ormCallback = function (error, stdout, stderr) {
                      ormsReturned++;

                      // log any relevant information from the orm exec call
                      that.logAll(resp, stdout, stderr, error);
                      X.log(ormsReturned + " of " + ormCount + " orm commands returned");
                      if (ormsReturned === ormCount) {
                        resp.status = resp.status || "SUCCESS";
                        that.respond(xtr, resp);
                      }
                    };
                  // end orm callback

                  // log any relevant information from the script exec call
                  that.logAll(resp, stdout, stderr, error);

                  if (ormsExist && error) {
                    // if the init script failed we might as well not run the orm. But increment
                    // the counter so that we know when to end.
                    X.log("Init script failed", error);
                    ormsReturned++;
                    if (ormsReturned === ormCount) {
                      resp.status = resp.status || "SUCCESS";
                      that.respond(xtr, resp);
                    }
                  } else if (ormsExist) {
                    // call the orm installer if applicable. We put this in the callback
                    // because the init scripts must have already been run
                    X.log("Executing (cd " + installerDir + " && exec " + ormCommand + pgPassword + ")");
                    exec("(cd " + installerDir + " && exec " + ormCommand + pgPassword + ")", ormCallback);
                    resp.commandLog.push(ormCommand);
                  }
                  commandsReturned++;

                  // TODO: error on timeout
                  if (commandsReturned === commandCount && ormCount === 0) {
                    resp.status = resp.status || "SUCCESS";
                    that.respond(xtr, resp);
                  }
                };
              // Note that until now we've just been setting up our callbacks.
              // Nothing has been run yet. We're actually still in a callback!


              // we need to keep track of the number of orms because we want to report back when every one
              // of them has been installed. Or, if there are no orms to install, we want to report back when
              // all of the init scripts have been run. Or, if there are no init scripts
              // to run then we report back at the end of the function.
              if (ormsExist) {
                ormCount++;
              }

              // execute command
              X.log("Executing (cd " + scriptDir + " && exec " + psqlCommand + ")");
              exec("(cd " + scriptDir + " && exec " + psqlCommand + ")", scriptCallback);
              commandCount++;
              resp.commandLog.push(psqlCommand);
            });
          });
          if (commandCount === 0) {
            // Report fully back even if no commands were run.
            resp.status = resp.status || "SUCCESS";
            that.respond(xtr, resp);
          }
        },
        fetchError = function (model, error) {
          resp.status = "ERROR";
          resp.errorCount++;
          resp.message = "Error while fetching organizations";
          that.respond(xtr, resp);
        },
        options,
        query = {
          parameters: [{
            attribute: "isActive",
            value: true
          }]
        };

      // allow the user to single out a particular organization
      // for updating if they want.
      if (args.organization) {
        query.parameters.push({
          attribute: "name",
          value: args.organization
        });
      }

      options = {
        success: fetchSuccess,
        error: fetchError,
        query: query,
        username: username
      };

      // Ok, NOW we've finally finished setting up all our callbacks. So now there's only one thing left
      // to do, is actually make the call.
      organizationColl.fetch(options);

    },

    /**
      Pushes the results from the exec calls into the resp object, which will be sent back to
      the client.
     */
    logAll: function (resp, stdout, stderr, error) {
      if (X.options.datasource.verboseMaintenanceLogging) {
        X.log(stdout);
      }
      resp.log.push(stdout);
      if (stderr) {
        resp.errorLog.push(stderr);
      }
      if (error !== null) {
        resp.status = "ERROR";
        resp.errorCount++;
        resp.errorLog.push("execution error: " + error);
      }
    },

    /**
      It's helpful for cron scripts to have a 200 or a 500 status based on
      the success of the response data object. We do that in one place, here.
    */
    respond: function (xtr, data) {
      var response = xtr.get("response"),
        httpStatus = data && data.status === "SUCCESS" ? 200 : 500;

      X.log("Maintenance is complete");
      response.writeHead(httpStatus, {"Content-Type": "text/plain"});
      response.write(JSON.stringify(data));
      response.end();
    },

    handles: ["maintenance", "/maintenance"]
  });
}());
