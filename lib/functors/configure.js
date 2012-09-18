/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    jsonToCsv: function (results) {
      var i,
        j,
        keys = [],
        key,
        result,
        subKey,
        subResult,
        isFirstSubresult,
        csv = "";

      // Each toplevel key will be a column. Don't assume that the
      // first record has all the keys
      for (i = 0; i < results.length; i++) {
        result = results[i];
        for (key in result) {
          //console.log("testing " + key);
          if (key !== 'id' &&
              key !== 'dataState' &&
              key !== 'type' && keys.indexOf(key) < 0) {
            //console.log("pushing " + key);
            keys.push(key);
          }
        }
      }

      // print the column headers
      for (j in keys) {
        if (keys.hasOwnProperty(j)) {
          csv += '"%@",'.f(keys[j]);
        }
      }
      csv += '\n';

      // print the rows
      for (i = 0; i < results.length; i++) {
        result = results[i];
        for (j in keys) {
          if (keys.hasOwnProperty(j)) {
            key = keys[j];
            if (typeof result[key] === 'object') {
              csv += '"';
              isFirstSubresult = true;
              for (subKey in result[key]) {
                if (subKey !== 'id' &&
                    subKey !== 'dataState' &&
                    subKey !== 'type') {

                  if (isFirstSubresult) {
                    isFirstSubresult = false;
                  } else {
                    csv += '\n';
                  }
                  subResult = result[key][subKey];
                  csv += subKey + ': ' + subResult;
                }
              }
              csv += '",';
            } else if (typeof result[key] === 'boolean') {
              // XXX shouldn't "".f() support booleans?
              csv += '"' + result[key] + '",';
            } else {
              csv += '"%@",'.f(result[key]);
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
