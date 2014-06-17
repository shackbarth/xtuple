/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */


(function () {
  "use strict";

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

      query.printFormat = true;
      data.queryDatabase("get", query, session, callback);
    });
  };

  // https://localtest.com/export?details={"requestType":"fetch","query":{"recordType":"XM.Locale"}}

  /**
    Recurses through json object to find all keys and subkeys
   */
  var getAllJsonKeys = function (json, prefix, keys, exclude) {
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
          getAllJsonKeys(json[key], newPrefix, keys, exclude);
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
  };

  /**
    Translates a string of a json array into a string of CSV.
    Flattens nested objects. Does not assume that the first result has all the keys
   */
  var jsonToCsv = function (results) {
    var i,
      j,
      // Each key (toplevel or otherwise) will be a column.
      // Note that we could save some computational power if we could assume that the
      // first record has all the keys, but it might not, espectially the subkeys
      keys = getAllJsonKeys(results, '', [], ['id', 'type', 'dataState']),
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
  };


  // export is a reserved word
  exports.exxport = function (req, res) {
    var requestDetails = JSON.parse(req.query.details),
      contentType = 'text/csv',
      query;

    queryForData(req.session, requestDetails, function (result) {
      if (result.isError) {
        res.send(result);
        return;
      } else {
        var resultAsCsv,
          filename = "export",
          type,
          number = requestDetails.query &&
                   requestDetails.query.details &&
                   requestDetails.query.details.id,
          attr = requestDetails.query &&
                 requestDetails.query.details &&
                 requestDetails.query.details.attr
          ;
        try {
          type = requestDetails.type;
          filename = type.replace("ListItem", "Export") +
                     (attr && number ? "-" + number : "") +
                     (attr           ? "-" + attr   : "")
                   ;

        } catch (error) {
          // "export" will have to do.
        }

        try {
          /* export requests have 2 flavors: export a list of records (data.data)
             or export a list of children of the current record ([0][attr]) */
          if (attr) {
            resultAsCsv = jsonToCsv(result.data.data[0][attr]);
          } else {
            resultAsCsv = jsonToCsv(result.data.data);
          }
          res.attachment(filename + ".csv");
        } catch (error) {
          resultAsCsv = jsonToCsv(error);
        }
        res.send(resultAsCsv);
      }
    });
  };

  exports.queryForData = queryForData;

}());
