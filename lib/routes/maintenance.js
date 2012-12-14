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
        outLog = "",
        errorLog = "",
        returnObject = {},
        url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        parsedArgs = querystring.parse(args),
        recordType = parsedArgs.recordType,
        recordId = parsedArgs.id,
        cookie = xtr.request.cookies.xtsessioncookie,
        session,
        sessionParams,
        response = xtr.get("response"),
        queryPayload,
        query;

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
                sudoUser = process.env.SUDO_USER,
                psqlCommand = psqlRoot + " -U " + sudoUser + " " + flags;


              //X.log(psqlCommand);
              //xtr.write(psqlCommand);
              // var psqlRoot = "/usr/bin/psql"; // maxhammer
              var child = exec("(cd " + scriptDir + " && exec " + psqlCommand + ")", function (error, stdout, stderr) {

                outLog += stdout;
                errorLog += stderr;
                if (error !== null) {
                  commandErrorCount++;
                  errorLog += "execution error: " + error;
                }
                commandsReturned++;
                if (commandsReturned === commandCount) {
                  console.log("All commands have returned");
                  returnObject.status = "Success";
                  returnObject.errorCount = commandErrorCount;
                  returnObject.log = outLog;
                  returnObject.errorLog = errorLog;
                  xtr.write(JSON.stringify(returnObject));
                  xtr.close();
                }
              });

              // execute command

              commandCount++;
              that.executeCommand(flags, xtr);

            });
          });
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
