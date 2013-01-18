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
  var error = function (session, xtr) {
    var response = xtr.get("response"),
      err = session.get("error");

    if (!err || typeof err !== 'string') {
      // just please keep the datasource from crashing
      console.log("error from session", session);
      err = "Error 12933";
    }
    //X.warn("error(): ", session.get("error"));
    session.removeAllListeners();
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write(err);
    response.end();
    //xtr.error({isError: true, reason: session.get("error")});
  };

  var getRequestDetails = function (originalUrl) {
    var url = require("url"),
      querystring = require("querystring"),
      args = url.parse(originalUrl).query;

    return querystring.parse(args).details;
  };

  var report = function (req, res) {
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

    session.once("error", _.bind(this.error, this, session, xtr));
    session.once("isReady", function () {

      // TODO: actually get the data (ideally via the REST API), put it in a temporary table with
      // a key, and use that key as the datakey.
      // TODO: strip out the row offset and row limits from the query
      // TODO: save the query string with the data so that we can give it to the reporting engine

      var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
        //requestUrl = pentahoRoot + "report.html?solution=erpbi-reports" +
        //  "&path=%2Ftest&name=GoogleDataSourceTest2.prpt&locale=en_US&queryparm=erp&userid=joe&password=password";
        dataKey = "121472837",
        redirectUrl = pentahoRoot + "report.html?solution=erpbi-reports&path=%2Ftest&name=ContactList.prpt" +
          "&locale=en_US&userid=joe&password=password&dataKey=" + dataKey;

      // thanks https://github.com/pksunkara/node-redirect
      xtrResponse.statusCode = 302;
      xtrResponse.setHeader('Content-Type', 'text/plain');
      xtrResponse.setHeader('Location', redirectUrl);
      xtrResponse.end('Redirecting to ' + redirectUrl);

    });
  };

  exports.report = report;
}());
