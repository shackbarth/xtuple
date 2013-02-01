/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X: true, XM:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */


  var queryForData = function (session, query, callback) {
    var userId = session.passport.user.username,
      userQueryPayload = '{"requestType":"retrieveRecord","recordType":"XM.UserAccountRelation","id":"%@"}'.f(userId),
      userQuery = "select xt.retrieve_record('%@')".f(userQueryPayload);

    // first make sure that the user has permissions to export to CSV
    // (can't trust the client)
    X.database.query(session.passport.user.organization, userQuery, function (err, res) {
      var retrievedRecord;

      if (err || !res || res.rowCount < 1) {
        callback("Error verifying user permissions", null);
        return;
      }

      retrievedRecord = JSON.parse(res.rows[0].retrieve_record);
      if (retrievedRecord.disableExport) {
        // nice try, asshole.
        callback("Stop trying to hack into our database", null);
        return;
      }

      X.database.query(session.passport.user.organization, query, callback);
    });
  };


  exports.report = function (req, res) {
    var requestDetails = req.query.details,
      requestDetailsQuery,
      query;

    requestDetails = JSON.parse(requestDetails);
    requestDetails.username = req.session.passport.user.username;
    requestDetailsQuery = JSON.stringify(requestDetails.query);
    requestDetails = JSON.stringify(requestDetails);
    query = "select xt.fetch('%@')".f(requestDetails);

    queryForData(req.session, query, function (err, result) {
      // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
      var randomKey = Math.random().toString(36).substr(2, 15),
        tempDataModel = new XM.BiCache(null, {isNew: true}),

        attrs = {
          key: randomKey,
          query: requestDetailsQuery,
          data: result.rows[0].fetch,
          created: new Date()
        },
        success = function () {
          // TODO: get the path from config
          var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
            redirectUrl = pentahoRoot + "report.html?solution=erpbi-reports&path=%2Ftest&name=ContactList.prpt" +
              "&locale=en_US&userid=joe&password=password&dataKey=" + randomKey;

          res.redirect(redirectUrl);
        },
        error = function (model, err, options) {
          res.send({isError: true, message: err});
        };

        //console.log("query", query);

      tempDataModel.save(attrs, {success: success, error: error});
    });
  };

}());
