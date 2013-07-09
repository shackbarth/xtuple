/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

var async = require("async"),
  routes = require("./routes");

(function () {
  "use strict";

  //
  // Get the most recent version of the core code
  // XXX: we'll need to sometimes give older versions
  // @param {String} language Can be "js" or "css".
  //
  var getCoreUuid = function (language, organization, callback) {
    var coll = new SYS.ClientCodeRelationCollection();
    coll.fetch({
      username: X.options.databaseServer.user,
      database: organization,
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
        callback(null, sortedModels[0].get("uuid"));
      }
    });
  };

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
   Figures out what extensions the user is entitled to. Queries to determine
   client code UUIDs for core and those extensions. Sends on to the app view
   to render.
   */
  exports.serveApp = function (req, res) {
    if (!req.session.passport.user) {
      routes.logout(req, res);
      return;
    }

    var user = new SYS.User(),
      fetchError = function (err) {
        X.log("Extension fetch error", err);
        res.send({isError: true, message: "Error fetching extensions"});
      },
      fetchSuccess = function (model, result) {
        var sendExtensions = function (res, extensions) {
          var uuids = _.map(extensions, function (ext) {
            var sortedModels = _.sortBy(ext.codeInfo, function (codeInfo) {
              return -1 * getVersionSize(codeInfo.version);
            });
            return sortedModels[0].uuid;
          });
          getCoreUuid('js', req.session.passport.user.organization, function (err, jsUuid) {
            if (err) {
              res.send({isError: true, error: err});
              return;
            }
            getCoreUuid('css', req.session.passport.user.organization, function (err, cssUuid) {
              if (err) {
                res.send({isError: true, error: err});
                return;
              }
              res.render('app', {
                org: req.session.passport.user.organization,
                coreJs: jsUuid,
                coreCss: cssUuid,
                extensions: uuids
              });
            });
          });
        };
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
            sendExtensions(res, extensions);
          });

        } else {
          // no second async call necessary
          sendExtensions(res, extensions);
        }
      };

    user.fetch({
      id: req.session.passport.user.username,
      success: fetchSuccess,
      error: fetchError,
      username: X.options.databaseServer.user,
      database: req.session.passport.user.organization
    });
  };

}());
