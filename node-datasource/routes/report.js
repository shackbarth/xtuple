/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X: true, XM:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */
  var data = require("./data");

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

      console.log(query);

      if (query.id) {
        // this is a request for a single record
        data.retrieveEngine(query, session, callback);
      } else {
        // this is a request for multiple records
        data.fetchEngine(query, session, callback);
      }
    });
  };
  exports.queryForData = queryForData;

  exports.report = function (req, res) {
    var requestDetails = JSON.parse(req.query.details);

    var bicacheCollection = new XM.BiCacheCollection(),
        fetchOptions = {},
        date,
        hourLifespan = 24,
        currentDate = new Date().getTime(),
        dateDifference;

    /*
      TODO: the date filter logic could be in the fetch itself to improve performance
    */

    /* the fetchOptions.success function below destroys any bicache models
        that are older than the number of hours set in the hourLifespan variable. */
    fetchOptions.success = function () {
      for (var i = 0; i < bicacheCollection.length; i++) {
        date = bicacheCollection.models[i].get("created");
        date = date.getTime();
        dateDifference = currentDate - date;
        if (dateDifference > (1000 * 60 * 60 * hourLifespan)) {
          bicacheCollection.models[i].destroy();
        }
      }
    };
    fetchOptions.error = function () {
      console.log("Couldn't fetch the BiCacheCollection");
    };
    bicacheCollection.fetch(fetchOptions);

    queryForData(req.session, requestDetails, function (result) {
      if (result.isError) {
        res.send(result);
        return;
      }
      // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
      var randomKey = Math.random().toString(36).substr(2, 15),
        tempDataModel = new XM.BiCache(null, {isNew: true}),

        attrs = {
          key: randomKey,
          query: JSON.stringify(requestDetails.query),
          data: JSON.stringify(result.data),
          created: new Date()
        },
        success = function () {
          var biUrl = X.options.datasource.biUrl || "",
            recordType = requestDetails.query ? requestDetails.query.recordType : requestDetails.recordType,
            modelName = recordType.suffix().replace("Item", ""),
            fileName = modelName + ".prpt",
            redirectUrl = biUrl + "&name=" + fileName + "&dataKey=" + randomKey;

          res.redirect(redirectUrl);
        },
        error = function (model, err, options) {
          res.send({
            isError: true,
            error: err,
            message: err.params && err.params.error && err.params.error.message
          });
        };

      tempDataModel.save(attrs, {success: success, error: error});
    });
  };

}());
