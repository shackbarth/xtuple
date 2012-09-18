/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

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

    handle: function (xtr, session, callback) {
      var that = this,
        payload = xtr.get("payload").payload,
        parameters = payload.parameters,
        id = session.get("details").id,
        oldPassword = parameters.oldPassword,
        newPassword = parameters.newPassword,
        didChangePassword = function (err, result) {
          if (err) {
            xtr.error(err);
          } else {
            xtr.write({data: {message: "Password change successful!"}}).close();
          }
        };

      // XXX this functionality really belong in the configure functor
      // but I'll keep it here pending a decision as to the long-term
      // strategy for the CSV export
      if (payload.functionName === 'createCSV') {
        var userId = session.get("details").username,
          userQueryPayload = '{"requestType":"retrieveRecord","recordType":"XM.UserAccountRelation","id":"%@"}'.f(userId),
          userQuery = "select xt.retrieve_record('%@')".f(userQueryPayload);

        if (!X.csvCache) {
          X.csvCache = {};
        }

        // first make sure that the user has permissions to export to CSV
        // (can't trust the client)
        session.query(userQuery, function (err, res) {
          var retrievedRecord, queryPayload, query;

          if (err || !res || res.rowCount < 1) {
            xtr.error({data: "Error verifying user permissions"});
            return;
          }

          retrievedRecord = JSON.parse(res.rows[0].retrieve_record);
          if (retrievedRecord.disableExport) {
            // nice try, asshole.
            xtr.error({data: "Stop trying to hack into our database"});
            return;
          }

          queryPayload = '{"requestType":"fetch","query":%@}'.f(JSON.stringify(parameters));
          query = "select xt.fetch('%@')".f(queryPayload);
          session.query(query, function (err, res) {
            var resultAsCsv,
              cacheId,
              now = new Date().getTime(),
              oldKey,
              oldTime;

            // now's as good a time as any to clear old records from the csv cache
            for (oldKey in X.csvCache) {
              if (X.csvCache.hasOwnProperty(oldKey)) {
                oldTime = X.csvCache[oldKey].timestamp;
                if (now - oldTime > 1000 * 60) {
                  // we'll guarantee 60 seconds of life for these csv strings
                  delete X.csvCache[oldKey];
                }
              }
            }

            if (err) {
              xtr.error({data: err});
            } else {
              resultAsCsv = that.jsonToCsv(JSON.parse(res.rows[0].fetch));
              // the session id is as good a cache key as any.
              cacheId = session.sid;
              X.csvCache[cacheId] = {timestamp: now, csv: resultAsCsv};

              xtr.write({data: {cacheId: cacheId}}).close();
            }
          });
        });
        return;
      }
      // XXX end part that doesn't belong here



      if (payload.functionName !== "updatePassword") {
        // that's the only thing we have set up to work through this functor
        xtr.error({reason: "Not a valid function for the configure functor"});
        return;
      }

      X.proxy.changePassword("user", {id: id, oldPassword: oldPassword, newPassword: newPassword}, didChangePassword);
    },

    handles: "function/configure",

    needsSession: true

  });
}());
