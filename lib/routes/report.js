/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._,
    nodeRequest = require("request");

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
        //var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
        //  requestUrl = pentahoRoot + "report.html?solution=erpbi-reports" +
        //    "&path=%2Ftest&name=GoogleDataSourceTest2.prpt&locale=en_US&queryparm=erp&userid=joe&password=password";
        var requestUrl = "http://google.com";
        nodeRequest(requestUrl, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            // hackwork:
            //body = body.replace(/href="/g, 'href="' + pentahoRoot);
            //body = body.replace(/src="/g, 'src="' + pentahoRoot);
            xtrResponse.writeHead(200, {"Content-Type": "text/html"});
            xtrResponse.write(body);
            xtrResponse.end();
          } else {
            xtrResponse.writeHead(500, {"Content-Type": "text/html"});
            xtrResponse.write("Error rendering report");
            xtrResponse.end();
          }
        })

      });
    },

    handles: "report /report".w()
  });
}());
