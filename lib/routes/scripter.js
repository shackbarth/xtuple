/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true */

(function () {
  "use strict";

  var _ = X._;

  // https://localtest.com/file?recordType=XM.File&id=40

  /**
    Used to serve up files to the client. Uses Content-Type to prompt browser to
    save the file

    @extends X.Route
    @class
   */
  X.scripterRoute = X.Route.create({

    handle: function (xtr) {
      var that = this,
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
            _.each(org.extensions, function (ext) {
              var extLoc = ext.extension.location,
                extName = ext.extension.name,
                scriptLocation = extLoc + "/source/" + extName + "/database/source/init_script.sql",
                host = org.databaseServer,
                orgName = org.name,
                command = "psql -d " + host + "/" + orgName + " -f " + scriptLocation + "\n";


              xtr.write(command);
              //console.log(command);
              // TODO: get dbserver details into org orm
            });
          });
          xtr.close();
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

    handles: ["scripter", "/scripter"]
  });
}());
