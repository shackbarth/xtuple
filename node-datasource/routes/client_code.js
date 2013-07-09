/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

var async = require("async");

(function () {
  "use strict";

  /**
    Just get a sense of how recent a version is without the dots.
    Higher version number string inputs will result in higher int outputs.
    Works with three or four dot-separated numbers.
  */
  var getVersionSize = function (version) {
    var versionSplit = version.split('.'),
      versionSize = 1000000 * versionSplit[0] +
        10000 * versionSplit[1] +
        100 * versionSplit[2];

    if (versionSplit.length > 3) {
      versionSize += versionSplit[3];
    }
    return versionSize;
  };

  /**
    Sends the bundled client code based on the user's extensions
    @param req.query.language {String} Can be css or js (default js)
   */
  exports.clientCode = function (req, res) {

    //
    // We have the UUID of the code we want. Fetch it.
    //
    var getCodeFromUuid = function (uuid, callback) {
      var code;

      X.clientCodeCache = X.clientCodeCache || {};

      code = X.clientCodeCache[uuid];
      if (code) {
        callback(null, code);
        return;
      }

      var model = new SYS.ClientCode();
      model.fetch({
        id: uuid,
        username: X.options.databaseServer.user,
        database: req.session.passport.user.organization,
        success: function (res, model) {
          code = model.get("code");
          X.clientCodeCache[uuid] = code;
          callback(null, code);
        },
        error: function (err) {
          callback(err);
        }
      });
    };

    getCodeFromUuid(req.query.uuid, function (err, result) {
      if (req.query.language === 'css') {
        res.set('Content-Type', 'text/css');
      } else {
        res.set('Content-Type', 'application/javascript');

      }
      res.send(result);
    });


  };
}());
