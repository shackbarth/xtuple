/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    jsonToCsv: function (results) {
      var i,
        key,
        result,
        csv = "";

      for (i = 0; i < results.length; i++) {
        result = results[i];
        if (i === 0) {
          for (key in result) {
            csv += '"%@",'.f(key);
          }
          csv += '\n';
        }
        for (key in result) {
          csv += '"%@",'.f(result[key]);
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

      // XXX this really doesn't belong here but I'm trying to figure out how this
      // whole thing works
      if (!X.csvCache) {
        X.csvCache = {};
      }
      var queryPayload = '{"requestType":"fetch","query":%@}'.f(JSON.stringify(parameters));
      var query = "select xt.fetch('%@')".f(queryPayload);
      if (payload.functionName === 'createCSV') {
        session.query(query, function (err, res) {
          var resultAsCsv, cacheId;

          if (err) {
            xtr.error({data: err});
            //if (callback) {callback(err, null); }
          } else {
            resultAsCsv = that.jsonToCsv(JSON.parse(res.rows[0].fetch));
            cacheId = 'csv_cache_' + session.sid;
            X.csvCache[cacheId] = resultAsCsv;

            xtr.write({data: {cacheId: cacheId}}).close();
            //if (callback) {callback(null, res); }
          }
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
