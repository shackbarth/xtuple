/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true */

(function () {
  "use strict";

  var _ = X._,
    exec = require('child_process').exec;

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
        commandErrorCount = 0,
        commandsReturned = 0,
        commandLog = [],
        outLog = [],
        errorLog = [],
        returnObject = {},
        url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = querystring.parse(url.parse(originalUrl).query);


      if (args.key !== 'blerg') {
        // TODO: better authentication
        //cookie = xtr.request.cookies.xtsessioncookie,
        returnObject.status = "ERROR";
        returnObject.error = "Unauthorized maintenance request";
        xtr.write(JSON.stringify(returnObject)).close();
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
                scriptName = "init_script.sql",
                host = org.databaseServer.hostname,
                port = org.databaseServer.port,
                orgName = org.name,
                flags = "-h " + host + " -p " + port + " -d " + orgName + " -f " + scriptName + "\n",
                psqlRoot = "/usr/local/pgsql/bin/psql",
                // var psqlRoot = "/usr/bin/psql"; // maxhammer
                sudoUser = process.env.SUDO_USER,
                psqlCommand = psqlRoot + " -U " + sudoUser + " " + flags,
                callback = function (error, stdout, stderr) {
                  outLog.push(stdout);
                  if (stderr) {
                    errorLog.push(stderr);
                  }
                  if (error !== null) {
                    commandErrorCount++;
                    errorLog.push("execution error: " + error);
                  }
                  commandsReturned++;

                  // TODO: error on timeout
                  if (commandsReturned === commandCount) {
                    returnObject.status = "SUCCESS";
                    returnObject.errorCount = commandErrorCount;
                    returnObject.log = outLog;
                    returnObject.commandLog = commandLog;
                    returnObject.errorLog = errorLog;
                    xtr.write(JSON.stringify(returnObject)).close();
                  }
                };

              // allow the user to single out a particular organization
              // for updating if they want.
              if (args.organization && args.organization !== orgName) {
                return;
              }

              // execute command
              exec("(cd " + scriptDir + " && exec " + psqlCommand + ")", callback);
              commandCount++;
              commandLog.push(psqlCommand);
            });
          });
          if (commandCount === 0) {
            // Report fully back even if no commands were run.
            returnObject.status = "SUCCESS";
            returnObject.errorCount = commandErrorCount;
            returnObject.log = outLog;
            returnObject.commandLog = commandLog;
            returnObject.errorLog = errorLog;
            xtr.write(JSON.stringify(returnObject)).close();
          }
        },
        fetchError = function (model, error) {
          console.log("fetch error");
          xtr.write("error").close();
        },
        options = {
          success: fetchSuccess,
          error: fetchError,
          username: X.options.globalDatabase.nodeUsername
        };

      organizationColl.fetch(options);

    },

    executeCommand: function (flags, xtr) {

    },

    handles: ["maintenance", "/maintenance"]
  });
}());
