/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */
  exports.report = function (req, res) {
    var that = this,
      requestDetails = req.query.details;

    // TODO: authentication
    // TODO: get the path from config
    var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
      //requestUrl = pentahoRoot + "report.html?solution=erpbi-reports" +
      //  "&path=%2Ftest&name=GoogleDataSourceTest2.prpt&locale=en_US&queryparm=erp&userid=joe&password=password";
      dataKey = "121472837",
      redirectUrl = pentahoRoot + "report.html?solution=erpbi-reports&path=%2Ftest&name=ContactList.prpt" +
        "&locale=en_US&userid=joe&password=password&dataKey=" + dataKey;

    res.redirect(redirectUrl);

    // TODO: actually get the data (ideally via the REST API), put it in a temporary table with
    // a key, and use that key as the datakey.
    // TODO: strip out the row offset and row limits from the query
    // TODO: save the query string with the data so that we can give it to the reporting engine
  };

}());
