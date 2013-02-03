/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, _:true */

(function () {
  "use strict";

  var exec = require('child_process').exec,
    url = require("url"),
    querystring = require("querystring"),
    path = require('path'),
    ormInstaller = require('../installer/orm');

  /*
   * The installer (the orm repo, actually) is an npm-managed dependency
   * in node-datasource
   */
  var installerDir = "node_modules/orm/installer";

  /**
    Pushes the results from the exec calls into the resp object, which will be sent back to
    the client.
   */
  var logAll = function (respObject, stdout, stderr, error) {
    if (X.options.datasource.verboseMaintenanceLogging) {
      X.log(stdout);
    }
    respObject.log.push(stdout);
    if (stderr) {
      respObject.errorLog.push(stderr);
    }
    if (error !== null) {
      respObject.status = "ERROR";
      respObject.errorCount++;
      respObject.errorLog.push("execution error: " + error);
    }
  };

  /**
    It's helpful for cron scripts to have a 200 or a 500 status based on
    the success of the response data object. We do that in one place, here.
  */
  var respond = function (res, data) {
    var httpStatus = data && data.status === "SUCCESS" ? 200 : 500;

    X.log("Maintenance is complete", JSON.stringify(data));
    res.send(httpStatus, JSON.stringify(data));
  };

  /**
   * The ORM installer commands need to be run sequentially. We create an array of the commands that
   * we have to run and then use recursion to do them one at a time here.
   */
  var runOrmCommands = function (ormArgs, pgPassword, respObject, res) {
    var ormCommand,
      ormCallback;

    // exit strategy
    if (ormArgs.length === 0) {
      respObject.status = respObject.status || "SUCCESS";
      respond(res, respObject);
      return;
    }

    ormCommand = ormArgs.pop();
    ormCallback = function (error, stdout, stderr) {
      // log any relevant information from the orm exec call
      X.log("ORM command returned. " + ormArgs.length + " left");
      logAll(respObject, stdout, stderr, error);

      // recurse down an ever-shortening array
      runOrmCommands(ormArgs, pgPassword, respObject, res);
    };
    X.log("Running ORM command: ", ormCommand);

    ormInstaller.run(ormCommand.ormCreds, ormCommand.ormDir, ormCallback);
  };

  /**
    This is the function that does all the work. It can be run after a successful
    session load, or through the localhost backdoor.
   */
  var install = function (res, args, username) {
    var commandCount = 0,
      commandsReturned = 0,
      ormArgs = [],
      ormCount = 0,
      ormsReturned = 0,
      respObject = {commandLog: [], log: [], errorLog: [], errorCount: 0},
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
              psqlCommand = psqlPath + " -U " + pgUser + " " + flags,
              scriptCallback = function (error, stdout, stderr) {
                // in the callback of the init script we will then run the orm installer if
                // applicable

                // note that we leave out the password from the command because it will
                // be reported back to the user
                var ormCreds = {
                  hostname: host,
                  organization: orgName,
                  username: pgUser,
                  port: port,
                  password: pgPassword
                };
                //nodePath + " installer.js -cli -h " + host + " -d " + orgName +
                 //   " -u " + pgUser + " -p " + port + " --path ../../../" + ormDir + " -P ";

                // log any relevant information from the script exec call
                logAll(respObject, stdout, stderr, error);

                if (ormsExist && error) {
                  // if the init script failed we might as well not run the orm. But increment
                  // the counter so that we know when to end.
                  X.log("Init script failed", error);
                  ormCount--;

                } else if (ormsExist) {
                  //
                  // we need to call the orms sequentially, and after the init scripts have
                  // been run. (Technically, we don't have to wait for *all* the init scripts
                  // to run before running specific ORMs, just the corresponding one. But
                  // nevertheless we wait for them all to finish. Also, we run all of the ORMs
                  // sequentially, even though strictly speaking we only need to run them
                  // sequentially within a given DB.
                  //
                  // The way we accomplish this is to push all the orm commands into an array
                  // and then run them sequentially once the array is complete.
                  //
                  X.log("Pushing creds for " + ormDir);
                  ormArgs.push({ormCreds: ormCreds, ormDir: ormDir});//"(cd " + installerDir + " && exec " + ormCommand + pgPassword + ")");
                  respObject.commandLog.push("Installing orms: " + ormDir);
                }

                if (ormCount === ormArgs.length) {
                  runOrmCommands(ormArgs, pgPassword, respObject, res);
                }
                commandsReturned++;
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
            respObject.commandLog.push(psqlCommand);
          });
        });
        if (commandCount === 0) {
          // Report fully back even if no commands were run.
          respObject.status = respObject.status || "SUCCESS";
          respond(res, respObject);
        }
      },
      fetchError = function (model, error) {
        respObject.status = "ERROR";
        respObject.errorCount++;
        respObject.message = "Error while fetching organizations";
        respond(res, respObject);
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

  };


  /**
    Runs extension init scripts and installs extension orms
    for organizations with the extensions activated. Saves
    a bunch of manual script running whenever an extension
    is updated or when an organization adds a new extension.

    @extends X.Route
    @class
   */
  var maintenance = function (req, res) {
    var host = req.headers.host,
      args = req.query;

    if (host === "localhost:442") {
      // users accessing this route through the unexposed server don't have to
      // get authenticated. Do the fetch under the node user authority.
      install(res, args, X.options.globalDatabase.nodeUsername);
      return;
    }

    // access through the main server uses the logged in user's authority
    install(res, args, req.session.passport.user.id);
  };

  exports.maintenance = maintenance;
}());

