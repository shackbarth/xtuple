/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    Defines the route which is a proxy for our Pentaho reporting server

    @extends X.Route
    @class
   */
  X.reportRoute = X.Route.create({
    getRequestDetails: function (originalUrl) {
      var url = require("url"),
        querystring = require("querystring"),
        args = url.parse(originalUrl).query;

      return querystring.parse(args).details;
    },

    handle: function (xtr) {
      var that = this,
        requestDetails = this.getRequestDetails(xtr.get("url")),
        xtrResponse = xtr.get("response"),
        cookie = xtr.request.cookies.xtsessioncookie,
        session,
        sessionParams,
        query;

      if (!cookie) {
        xtrResponse.writeHead(200, {"Content-Type": "text/html"});
        xtrResponse.write("You need a valid cookie!");
        xtrResponse.end();
        return;
      }

      sessionParams = JSON.parse(cookie);
      session = X.Session.create(sessionParams);

      session.once("isReady", function () {

        // TODO: actually get the data (ideally via the REST API), put it in a temportary table with
        // a key, and use that key as the datakey.
        var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
          //requestUrl = pentahoRoot + "report.html?solution=erpbi-reports" +
          //  "&path=%2Ftest&name=GoogleDataSourceTest2.prpt&locale=en_US&queryparm=erp&userid=joe&password=password";
          dataKey = "121472837",
          redirectUrl = pentahoRoot + "report.html?dataKey=" + dataKey;

        // thanks https://github.com/pksunkara/node-redirect
        xtrResponse.statusCode = 302;
        xtrResponse.setHeader('Content-Type', 'text/plain');
        xtrResponse.setHeader('Location', redirectUrl);
        xtrResponse.end('Redirecting to ' + redirectUrl);

      });
    },

    handles: "report /report".w()
  });
}());
