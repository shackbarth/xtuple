/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  // https://localtest.com/export?details={"requestType":"fetch","query":{"recordType":"XM.Locale"}}

  /**
    Defines the export route.

    @extends X.Route
    @class
   */
  X.exportRoute = X.Route.create({

    /**
      Recurses through json object to find all keys and subkeys
     */
    getAllJsonKeys: function (json, prefix, keys, exclude) {
      var key, newPrefix, suffix;

      if (typeof json === 'object') {
        for (key in json) {
          if (json.hasOwnProperty(key)) {
            if (json && json.length) {
              // don't want to pass the key if it's an array
              newPrefix = prefix;
            } else if (!prefix) {
              // don't add a dot unless there's something to add a dot to
              newPrefix = key;
            } else {
              newPrefix = prefix + '.' + key;
            }
            this.getAllJsonKeys(json[key], newPrefix, keys, exclude);
          }
        }

      } else {
        // add this key unless it's already added or unless it's meant to be excluded
        suffix = prefix;
        if (suffix.indexOf('.') >= 0) {
          suffix = suffix.substring(suffix.lastIndexOf('.') + 1);
        }
        if (keys.indexOf(prefix) < 0 && exclude.indexOf(suffix) < 0) {
          keys.push(prefix);
        }
      }
      return keys;
    },

    /**
      Translates a string of a json array into a string of CSV.
      Flattens nested objects. Does not assume that the first result has all the keys
     */
    jsonToCsv: function (results) {
      var i,
        j,
        // Each key (toplevel or otherwise) will be a column.
        // Note that we could save some computational power if we could assume that the
        // first record has all the keys, but it might not, espectially the subkeys
        keys = this.getAllJsonKeys(results, '', [], ['id', 'type', 'dataState']),
        row,
        key,
        value,
        recursingValue,
        csv = "";

      // print the column headers
      for (j in keys) {
        if (keys.hasOwnProperty(j)) {
          csv += '"%@",'.f(keys[j]);
        }
      }
      csv += '\n';

      // print each row
      for (i = 0; i < results.length; i++) {
        row = results[i];
        for (j in keys) {
          if (keys.hasOwnProperty(j)) {
            key = keys[j];
            value = row[key];

            if (key.indexOf('.') >= 0) {
              // recurse down into values of objects for nested values
              recursingValue = row;
              while (recursingValue && key.indexOf('.') >= 0) {
                recursingValue = recursingValue[key.substring(0, key.indexOf('.'))];
                key = key.substring(key.indexOf('.') + 1);
              }
              value = recursingValue ? recursingValue[key] : "";
            }

            // escape double quotes: " becomes ""
            if (typeof value === 'string' && value.indexOf("\"") >= 0) {
              value.replace(/\"/g, /\"\"/);
            }
            if (!value) {
              csv += '"",';
            } else if (typeof value === 'number' || !isNaN(value)) {
              // don't put numbers in quotes
              csv += '%@,'.f(value);
            } else {
              csv += '"%@",'.f(value);
            }
          }
        }
        csv += '\n';
      }
      return csv;
    },

    queryForCsv: function (session, query, callback) {
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
          var resultAsCsv;

          if (err) {
            callback(err, null);
          } else {
            resultAsCsv = that.jsonToCsv(JSON.parse(res.rows[0].fetch));
            callback(null, resultAsCsv);
          }
        });
      });
    },

    getRequestDetails: function (originalUrl) {
      var url = require("url"),
        querystring = require("querystring"),
        args = url.parse(originalUrl).query;

      return querystring.parse(args).details;
    },

    // TODO: exception handling
    handle: function (xtr) {
      var that = this,
        requestDetails = this.getRequestDetails(xtr.get("url")),
        response = xtr.get("response"),
        contentType = 'text/csv',
        cookie = xtr.request.cookies.xtsessioncookie,
        session,
        sessionParams,
        query;

      if (!cookie) {
        response.writeHead(200, {"Content-Type": contentType});
        response.write("You need a valid cookie!");
        response.end();
      }

      query = "select xt.fetch('%@')".f(requestDetails);

      // we could shorten the necessary url by making some assumptions...
      //queryPayload = '{"requestType":"fetch","query":%@}'.f(parameters);
      //query = "select xt.fetch('%@')".f(queryPayload);


      sessionParams = JSON.parse(cookie);
      //sessionParams.payload = JSON.parse(requestDetails); // XXX do I really need to pass the payload?

      session = X.Session.create(sessionParams);

      session.once("isReady", function () {
        var filename = "export",
          queryObject,
          recordType;
        try {
          // try to name the file after the record type
          queryObject = JSON.parse(requestDetails);
          recordType = queryObject.query.recordType;
          // suffix() would be better than substring() but doesn't exist here yet
          filename = recordType.substring(3).replace("ListItem", "") + "Export";

        } catch (error) {
          // "export" will have to do.
        }

        that.queryForCsv(session, query, function (err, res) {
          if (err) {
            response.writeHead(500, {"Content-Type": contentType});
            response.write("Error querying database");
            response.end();
            //xtr.error({data: err});
          } else {

            response.writeHead(200, {"Content-Type": contentType, "Content-Disposition": "attachment; filename = %@.csv".f(filename) });
            response.write(res);
            response.end();
            //xtr.write({data: res}).close();
          }
        });
      });
    },

    handles: "export /export".w()
  });
}());
