/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

var async = require("async"),
  path = require("path"),
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
    var versionSplit = version.split('.'),                  // e.g. "4.5.0-beta2".
      versionSize = 1000000 * versionSplit[0] +             // Get "4" from "4.5.0-beta2".
        10000 * versionSplit[1] +                           // Get "5" from "4.5.0-beta2".
        100 * versionSplit[2].match(/^[0-9]+/g, '')[0],     // Get "0" from "0-beta2".
      prerelease = versionSplit[2].replace(/^[0-9]+/g, ''), // Get "-beta2" from "0-beta2".
      preRegEx = /([a-zA-Z]+)([0-9]*)/g,                    // Capture pre-release as ["beta2", "beta", "2"].
      preMatch = preRegEx.exec(prerelease),
      preVersion,
      preNum;

    if (versionSplit.length > 3) {
      versionSize += versionSplit[3];
    }

    if (preMatch && preMatch.length && preMatch[0] !== '') {
      if (preMatch[1] !== '') {
        preVersion = preMatch[1].match(/[a-zA-Z]+/g);       // Get ["beta"] from ["beta2", "beta", "2"].

        // Decrease versionSize for pre-releasees.
        switch (preVersion[0].toLowerCase()) {
          case 'alpha':
            versionSize = versionSize - 50;
            break;
          case 'beta':
            versionSize = versionSize - 40;
            break;
          case 'rc':
            versionSize = versionSize - 20;
            break;
          default :
            X.err("Cannot get pre-release version number.");
        }
      }

      // Add pre-release version to versionSize.
      if (preMatch[2] !== '') {
        preNum = preMatch[2].match(/[0-9]+/g);              // Get ["2"] from ["beta2", "beta", "2"].
        versionSize = versionSize + parseInt(preNum);
      }
    }

    return versionSize;
  };


  /**
   Figures out what extensions the user is entitled to. Queries to determine
   client code UUIDs for core and those extensions. Sends on to the app view
   to render.
   */
  var serveApp = exports.serveApp = function (req, res) {
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
          var filteredExtensions;
          if (req.query.extensions) {
            // the user is requesting to only see a certain set of extensions
            filteredExtensions = JSON.parse(req.query.extensions);
            extensions = extensions.filter(function (ext) {
              return _.contains(filteredExtensions, ext.name);
            });
          }

          extensions.sort(function (ext1, ext2) {
            if (ext1.loadOrder !== ext2.loadOrder) {
              return ext1.loadOrder - ext2.loadOrder;
            } else {
              return ext1.name > ext2.name ? 1 : -1;
            }
          });
          var getLatestUuid = function (extensions, language) {
            var uuids = _.map(extensions, function (ext) {
              var jsModels = _.filter(ext.codeInfo, function (codeInfo) {
                return codeInfo.language === language;
              });
              var sortedModels = _.sortBy(jsModels, function (codeInfo) {
                return -1 * getVersionSize(codeInfo.version);
              });
              if (sortedModels[0]) {
                return sortedModels[0].uuid;
              } else {
                X.log("Could not find js uuid for extension " + ext.description);
                return null;
              }
            });
            return _.compact(uuids); // eliminate any null values
          };
          var extJsUuids = getLatestUuid(extensions, "js");
          var extCssUuids = getLatestUuid(extensions, "css");
          var extensionPaths = _.compact(_.map(extensions, function (ext) {
            var locationName = ext.location.indexOf("/") === 0 ?
              path.join(ext.location, "source") :
              "/" + ext.location;
            return path.join(locationName, ext.name);
          }));
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
              res.render(req.viewName || 'app', {
                org: req.session.passport.user.organization,
                coreJs: jsUuid,
                coreCss: cssUuid,
                extensionJsArray: extJsUuids,
                extensionCssArray: extCssUuids,
                extensionPaths: extensionPaths
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

  exports.serveDebug = function (req, res) {
    req.viewName = "debug";
    serveApp(req, res);
  };
}());
