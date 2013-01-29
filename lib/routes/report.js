/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var _ = X._;

  // https://localtest.com/report?details={%22requestType%22:%22fetch%22,%22query%22:{%22orderBy%22:[{%22attribute%22:%22lastName%22},{%22attribute%22:%22firstName%22},{%22attribute%22:%22primaryEmail%22},{%22attribute%22:%22id%22,%22numeric%22:true}],%22parameters%22:[{%22attribute%22:%22isActive%22,%22operator%22:%22=%22,%22value%22:true}],%22recordType%22:%22XM.ContactListItem%22}}

  /**
    Defines the route which is a proxy for our Pentaho reporting server

    @extends X.Route
    @class
   */
  X.reportRoute = X.Route.create({
    error: function (session, xtr) {
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
    },
    getRequestDetails: function (originalUrl) {
      var url = require("url"),
        querystring = require("querystring"),
        args = url.parse(originalUrl).query;

      return querystring.parse(args).details;
    },

    queryForData: function (session, query, callback) {
      var that = this,
        userId = session.get("details").username,
        userQueryPayload = '{"requestType":"retrieveRecord","recordType":"XM.UserAccountRelation","id":"%@"}'.f(userId),
        userQuery = "select xt.retrieve_record('%@')".f(userQueryPayload);

      // first make sure that the user has permissions to export to CSV
      // (can't trust the client)
      session.query(userQuery, function (err, res) {
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

        session.query(query, function (err, res) {
          var result;

          if (err) {
            callback(err, null);
          } else {
            callback(null, res.rows[0].fetch);
          }
        });
      });
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

      query = "select xt.fetch('%@')".f(requestDetails);

      sessionParams = JSON.parse(cookie);
      session = X.Session.create(sessionParams);

      session.once("error", _.bind(this.error, this, session, xtr));
      session.once("isReady", function () {

        that.queryForData(session, query, function (err, res) {
          // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
          var randomKey = Math.random().toString(36).substr(2, 15),
            tempDataModel = new XM.PentahoTempQueryData(null, {isNew: true}),
            attrs = {
              key: randomKey,
              query: "query", // TODO: get the real query in here. Need to escape it somehow.
              data: res,
              created: new Date()
            },
            success = function () {
              // TODO: save the query string with the data so that we can give it to the reporting engine
              var pentahoRoot = "http://maxhammer.xtuple.com:8080/pentaho/content/reporting/reportviewer/",
                redirectUrl = pentahoRoot + "report.html?solution=erpbi-reports&path=%2Ftest&name=ContactList.prpt" +
                  "&locale=en_US&userid=joe&password=password&dataKey=" + randomKey;

              // thanks https://github.com/pksunkara/node-redirect
              xtrResponse.statusCode = 302;
              xtrResponse.setHeader('Content-Type', 'text/plain');
              xtrResponse.setHeader('Location', redirectUrl);
              xtrResponse.end('Redirecting to ' + redirectUrl);
            },
            error = function (model, err, options) {
              xtr.error(err);
            };

          tempDataModel.save(attrs, {success: success, error: error});
        });



      });
    },

    handles: "report /report".w()
  });
}());
