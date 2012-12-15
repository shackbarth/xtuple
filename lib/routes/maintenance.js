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
    Used to serve up files to the client. Uses Content-Type to prompt browser to
    save the file

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


      if (args.key !== 'blerg') {
        // TODO: better authentication
        //cookie = xtr.request.cookies.xtsessioncookie,
        resp.status = "ERROR";
        resp.message = "Unauthorized maintenance request";
        xtr.write(JSON.stringify(resp)).close();
        return;
      }

      var organizationColl = new XM.OrganizationCollection(),
        fetchSuccess = function (model, response) {
          _.each(response, function (org) {
            if (!org.isActive) {
              // no need to update disactivated organizations
              return;
            }
            _.each(org.extensions, function (ext) {
              var extLoc = ext.extension.location,
                extName = ext.extension.name,
                scriptDir = ".." + extLoc + "/source/" + extName + "/database/source",
                ormDir = ".." + extLoc + "/source/" + extName + "/database/orm",
                // XXX use fs.existsSync in node 0.8
                ormsExist = path.existsSync(ormDir),
                scriptName = "init_script.sql",
                host = org.databaseServer.hostname,
                port = org.databaseServer.port,
                orgName = org.name,
                flags = "-h " + host + " -p " + port + " -d " + orgName + " -f " + scriptName + "\n",
                // TODO: determine psql path using exec which somehow
                psqlPath = X.options.datasource.psqlPath || "/usr/bin/psql", // maxhammer is default
                sudoUser = process.env.SUDO_USER,
                psqlCommand = psqlPath + " -U " + sudoUser + " " + flags,
                callback = function (error, stdout, stderr) {
                  var ormCommand = "./installer.js -cli -h " + host + " -d " + orgName +
                      " -u " + sudoUser + " -p " + port + " --path ../../" + ormDir + " -P",
                    installerDir = "node_modules/orm/installer",
                    ormCallback = function (error, stdout, stderr) {
                      ormsReturned++;
                      resp.log.push(stdout);
                      if (stderr) {
                        resp.errorLog.push(stderr);
                      }
                      if (error !== null) {
                        resp.errorCount++;
                        resp.errorLog.push("execution error: " + error);
                      }
                      if (ormsReturned === ormCount) {
                        resp.status = "SUCCESS";
                        xtr.write(JSON.stringify(resp)).close();
                      }
                    };

                  resp.log.push(stdout);
                  if (stderr) {
                    resp.errorLog.push(stderr);
                  }
                  if (error !== null) {
                    resp.errorCount++;
                    resp.errorLog.push("execution error: " + error);
                  }

                  // install orms
                  if (ormsExist) {
                    // run the orm installer after the init script has finished
                    exec("(cd " + installerDir + " && exec " + ormCommand + ")", ormCallback);
                  }
                  commandsReturned++;

                  // TODO: error on timeout
                  if (commandsReturned === commandCount && ormCount === 0) {
                    resp.status = "SUCCESS";
                    xtr.write(JSON.stringify(resp)).close();
                  }
                };

              // allow the user to single out a particular organization
              // for updating if they want.
              if (args.organization && args.organization !== orgName) {
                return;
              }

              // we need to keep track of the number of orms because we want to report back when every one
              // of them has been installed. Or, if there are no orms to install, we want to report back when
              // all of the init scripts have been run. Or, of course, if there are no init scripts
              // to run then we report back at the end of the function.
              if (ormsExist) {
                ormCount++;
              }

              // execute command
              exec("(cd " + scriptDir + " && exec " + psqlCommand + ")", callback);
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
          resp.message = "Error while fetching organizations";
          xtr.write(JSON.stringify(resp)).close();
        },
        options = {
          success: fetchSuccess,
          error: fetchError,
          username: X.options.globalDatabase.nodeUsername
        };

      organizationColl.fetch(options);

    },

    handles: ["maintenance", "/maintenance"]
  });
}());
