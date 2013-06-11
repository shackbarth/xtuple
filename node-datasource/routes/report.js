/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, XM:true, SYS:true */

(function () {
  "use strict";

  /**
    When a client asks us to run a report, run it, save it in a temporary table,
    and redirect to pentaho with a key that will allow pentaho to access the report.
   */
  var data = require("./data");

  var queryForData = function (session, query, callback) {

    var userId = session.passport.user.username,
      adminUser = X.options.databaseServer.user, // execute this query as admin
      userQueryPayload = '{"nameSpace":"SYS","type":"User","id":"%@","username":"%@"}'
        .f(userId, adminUser),
      userQuery = "select xt.get('%@')".f(userQueryPayload),
      queryOptions = XT.dataSource.getAdminCredentials(session.passport.user.organization);

    // first make sure that the user has permissions to export to CSV
    // (can't trust the client)
    XT.dataSource.query(userQuery, queryOptions, function (err, res) {
      var retrievedRecord;
      if (err || !res || res.rowCount < 1) {
        callback({isError: true, message: "Error verifying user permissions"});
        return;
      }

      retrievedRecord = JSON.parse(res.rows[0].get);
      if (retrievedRecord.data.disableExport) {
        // nice try, asshole.
        callback({isError: true, message: "Stop trying to hack into our database"});
        return;
      }

      data.queryDatabase("get", query, session, callback);
    });
  };
  exports.queryForData = queryForData;

  exports.report = function (req, res) {
    var requestDetails = JSON.parse(req.query.details);

    var bicacheCollection = new SYS.BiCacheCollection(),
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
        date = new Date(bicacheCollection.models[i].get("created"));
        dateDifference = currentDate - date.getTime();
        if (dateDifference > (1000 * 60 * 60 * hourLifespan)) {
          bicacheCollection.models[i].destroy();
        }
      }
    };
    fetchOptions.error = function () {
      console.log("Couldn't fetch the BiCacheCollection");
    };
    fetchOptions.database = req.session.passport.user.organization;
    bicacheCollection.fetch(fetchOptions);

    var queryForDataCallback = function (result) {
      var type = requestDetails.type,
        modelName,
        queryOptions,
        fileName;

      if (result.isError) {
        res.send(result);
        return;

      } else if (!type) {
        res.send({isError: true, message: "You must pass a type"});
        return;
      }
      modelName = type.replace("ListItem", "").replace("Relation", "");
      fileName = type.replace("ListItem", "List").replace("Relation", "List") + ".prpt";

      if (result.isError) {
        res.send(result);
        return;
      }

      var saveBiCache = function (err, schemaResult) {
        var schema = schemaResult && schemaResult.rows.length && schemaResult.rows[0].getschema;

        // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
        var randomKey = Math.random().toString(36).substr(2, 15),
          tempDataModel = new SYS.BiCache(null, {isNew: true, database: req.session.passport.user.organization}),
          attrs = {
            key: randomKey,
            query: JSON.stringify(requestDetails.query),
            locale: JSON.stringify(requestDetails.locale),
            data: JSON.stringify(result.data),
            schema: schema,
            created: new Date()
          },
          success = function () {
            var biUrl = X.options.datasource.biUrl || "",
              redirectUrl = biUrl + "&name=" + fileName +
                "&org=" + req.session.passport.user.organization +
				"&datasource=" + req.headers.host + "&datakey=" + randomKey;

            if (requestDetails.locale && requestDetails.locale.culture) {
              res.set("Accept-Language", requestDetails.locale.culture);
            }
            // step 4: redirect to the report tool
            res.redirect(redirectUrl);
          },
          error = function (model, err, options) {
            res.send({
              isError: true,
              error: err,
              message: err.params && err.params.error && err.params.error.message
            });
          };

        // step 3: save to the bicache table
        tempDataModel.save(attrs, {
          success: success,
          error: error,
          database: req.session.passport.user.organization,
          username: X.options.databaseServer.user
        });
      };

      // step 2: get the schema
      queryOptions = XT.dataSource.getAdminCredentials(req.session.passport.user.organization);
      XT.dataSource.query("select xt.getSchema('%@', '%@');".f(requestDetails.nameSpace, modelName),
        queryOptions,
        saveBiCache);
    };

    // step 1: get the data
    queryForData(req.session, requestDetails, queryForDataCallback);
  };

}());
