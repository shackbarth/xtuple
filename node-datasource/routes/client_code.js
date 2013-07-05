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

    //
    // Get the most recent version of the core code
    // XXX: we'll need to sometimes give older versions
    // @param {String} language Can be "js" or "css".
    //
    var getCoreCode = function (language, callback) {
      var coll = new SYS.ClientCodeRelationCollection();
      coll.fetch({
        username: X.options.databaseServer.user,
        database: req.session.passport.user.organization,
        query: {
          parameters: [
            { attribute: "language", value: language },
            { attribute: "extension", value: null, includeNull: true }
          ]
        },
        success: function (coll, res) {
          var sortedModels = _.sortBy(coll.models, function (model) {
            return -1 * getVersionSize(model.get("version"));
          });
          getCodeFromUuid(sortedModels[0].get("uuid"), callback);
        }
      });
    };

    //
    // Given a list of extensions the user is granted, fetch the
    // client code of those extension (and the core) and return it.
    //
    var bundleClientCode = function (extensions) {
      var uuids = _.map(extensions, function (ext) {
        var sortedModels = _.sortBy(ext.codeInfo, function (codeInfo) {
          return -1 * getVersionSize(codeInfo.version);
        });
        return sortedModels[0].uuid;
      });

      async.map(uuids, getCodeFromUuid, function (err, results) {
        if (err) {
          res.send({isError: true, error: err});
          return;
        }
        var allCode = _.reduce(results, function (memo, result) {
          return memo + result;
        }, "");
        getCoreCode("js", function (err, result) {
          allCode = result + allCode;
          res.set('Content-Type', 'application/javascript');
          res.send(allCode);
        });
      });
    };


    //
    // Start the execution
    //

    //
    // Send the client the most recent css.
    // XXX: right now the only css is in the core, but that probably won't last forever
    //
    if (req.query.language === "css") {
      getCoreCode("css", function (err, result) {
        res.set('Content-Type', 'text/css');
        res.send(result);
      });
      return;
    }

    //
    // Typical execution: figure out what extensions the client is entitled to,
    // and bundle and return those.
    //
    var userCollection = new SYS.UserCollection(),
      fetchError = function (err) {
        X.log("Extension fetch error", err);
        res.send({isError: true, message: "Error fetching extensions"});
      },
      fetchSuccess = function (collection, result) {
        var getExtensionFromRole = function (role, callback) {
          var id = role.userAccountRole,
            roleModel = new SYS.UserAccountRole();

          roleModel.fetch({id: id,
            username: X.options.databaseServer.user,
            database: req.session.passport.user.organization,
            success: function (model, result) {
              var extensions = _.map(model.get("grantedExtensions"), function (ext) {
                return ext.extension;
              });
              callback(null, extensions);
            },
            error: function (err) {
              callback(err);
            }
          });
        };
        var user = _.find(collection.models, function (obj) {
          return obj.get("username") === req.session.passport.user.username;
        });
        var extensions = _.map(user.get("grantedExtensions"), function (ext) {
          return ext.extension;
        });
        // Add the extensions that the user gets from his roles
        var userAccountRoles = user.get("grantedUserAccountRoles");
        if (userAccountRoles.length > 0) {
          // we're going to have to do more async calls to get all the
          // extensions related to these roles.
          async.map(userAccountRoles, getExtensionFromRole, function (err, results) {
            if (err) {
              res.send({isError: true, message: "error in extension route"});
              return;
            }
            // add all role-granted extensions that are not already there
            _.each(results, function (result) {
              _.each(result, function (newExt) {
                var preExistingExt = _.find(extensions, function (currentExt) {
                  return currentExt.id === newExt.id;
                });
                if (!preExistingExt) {
                  extensions.push(newExt);
                }
              });
            });
            bundleClientCode(extensions);
          });

        } else {
          // no second async call necessary
          bundleClientCode(extensions);
        }

      };

    // Fetch under the authority of admin
    // or else most users would not be able to load their own extensions.
    // TODO: just fetch the model instead of the whole collection
    userCollection.fetch({
      success: fetchSuccess,
      error: fetchError,
      username: X.options.databaseServer.user,
      database: req.session.passport.user.organization
    });
  };
}());
