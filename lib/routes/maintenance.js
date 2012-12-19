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

    handle: function (xtr) {
      var that = this,
        commandCount = 0,
        commandsReturned = 0,
        ormCount = 0,
        ormsReturned = 0,
        resp = {commandLog: [], log: [], errorLog: [], errorCount: 0},
        originalUrl = xtr.get("url"),
        args = querystring.parse(url.parse(originalUrl).query);


      if (args.key !== 'blerg') { // preposterous
        // TODO: better authentication
        //cookie = xtr.request.cookies.xtsessioncookie,
        resp.status = "ERROR";
        resp.errorCount++;
        resp.message = "Unauthorized maintenance request";
        xtr.write(JSON.stringify(resp)).close();
        return;
      }

      var organizationColl = new XM.OrganizationCollection(),
        //
        // practically all the code is in the success callback of the initial fetch
        // on the organization collection
        //
        fetchSuccess = function (model, response) {
          _.each(response, function (org) {
            _.each(org.extensions, function (ext) {
              //
              // go through all of the extensions of all the organizations...
              //

              if (args.extensions && JSON.parse(args.extensions).indexOf(ext.extension.id) < 0) {
                // if the user has specified that only some extensions are to be loaded,
                // then we stop here if this extension at hand is not on that list
                return;
              }

              var extLoc = ext.extension.location,
                extName = ext.extension.name,
                scriptDir = ".." + extLoc + "/source/" + extName + "/database/source",
                ormDir = ".." + extLoc + "/source/" + extName + "/database/orm",
                // XXX use fs.existsSync in node 0.8 instead of path.existsSync
                ormsExist = path.existsSync(ormDir),
                scriptName = "init_script.sql",
                host = org.databaseServer.hostname,
                port = org.databaseServer.port,
                orgName = org.name,
                flags = "-h " + host + " -p " + port + " -d " + orgName + " -f " + scriptName + "\n",
                psqlPath = X.options.datasource.psqlPath || "psql",
                psqlUser = X.options.datasource.psqlUser || "admin",
                psqlCommand = psqlPath + " -U " + psqlUser + " " + flags,
                scriptCallback = function (error, stdout, stderr) {
                  // in the callback of the init script we will then run the orm installer if
                  // applicable
                  var ormCommand = "./installer.js -cli -h " + host + " -d " + orgName +
                      " -u " + psqlUser + " -p " + port + " --path ../../" + ormDir + " -P",
                    // the installer (the orm repo, actually) is an npm-managed dependency
                    // in node-datasource
                    installerDir = "node_modules/orm/installer",
                    ormCallback = function (error, stdout, stderr) {
                      ormsReturned++;

                      // log any relevant information from the orm exec call
                      that.logAll(resp, stdout, stderr, error);
                      if (ormsReturned === ormCount) {
                        resp.status = "SUCCESS";
                        xtr.write(JSON.stringify(resp)).close();
                      }
                    };
                  // end orm callback

                  // log any relevant information from the script exec call
                  that.logAll(resp, stdout, stderr, error);

                  // call the orm installer if applicable. We put this in the callback
                  // because the init scripts must have already been run
                  if (ormsExist) {
                    exec("(cd " + installerDir + " && exec " + ormCommand + ")", ormCallback);
                  }
                  commandsReturned++;

                  // TODO: error on timeout
                  if (commandsReturned === commandCount && ormCount === 0) {
                    resp.status = "SUCCESS";
                    xtr.write(JSON.stringify(resp)).close();
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
              exec("(cd " + scriptDir + " && exec " + psqlCommand + ")", scriptCallback);
              commandCount++;
              resp.commandLog.push(psqlCommand);
            });
          });
          if (commandCount === 0) {
            // Report fully back even if no commands were run.
            resp.status = "SUCCESS";
            xtr.write(JSON.stringify(resp)).close();
          }
        },
        fetchError = function (model, error) {
          resp.status = "ERROR";
          resp.errorCount++;
          resp.message = "Error while fetching organizations";
          xtr.write(JSON.stringify(resp)).close();
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
        username: X.options.globalDatabase.nodeUsername
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
      resp.log.push(stdout);
      if (stderr) {
        resp.errorLog.push(stderr);
      }
      if (error !== null) {
        resp.errorCount++;
        resp.errorLog.push("execution error: " + error);
      }
    },

    handles: ["maintenance", "/maintenance"]
  });
}());
