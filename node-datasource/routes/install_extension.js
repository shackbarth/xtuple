/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, _:true */

(function () {
  "use strict";

  var async = require("async"),
    npm = require("npm"),
    path = require("path"),
    buildAll = require("../../scripts/lib/build_all");

  exports.installExtension = function (req, res) {
    var database = req.session.passport.user.organization,
      extensionName = req.query.extensionName,
      username = req.session.passport.user.id,
      user = new SYS.User(),
      validateInput = function (callback) {
        if (!extensionName) {
          callback("Error: empty extension name");
          return;
        }
        callback();
      },
      validateUser = function (callback) {
        user.fetch({
          id: username,
          username: X.options.databaseServer.user,
          database: database,
          success: function (model, results) {
            // TODO: also check role-granted privileges
            var privCheck = _.find(model.get("grantedPrivileges"), function (model) {
              return model.privilege === "InstallExtension";
            });
            if (privCheck) {
              callback(); // the user has this privilege!
              return;
            }
            // this gets a little dicey: check all the user's roles for the priv, which
            // requires async.map
            var roles = _.map(model.get("grantedUserAccountRoles"), function (grantedRole) {
              return grantedRole.userAccountRole;
            });
            var checkRole = function (roleName, next) {
              var role = new SYS.UserAccountRole();
              role.fetch({
                id: roleName,
                username: X.options.databaseServer.user,
                database: database,
                success: function (roleModel, results) {
                  var rolePriv = _.find(roleModel.get("grantedPrivileges"), function (grantedPriv) {
                    return grantedPriv.privilege === "InstallExtension";
                  });
                  next(null, rolePriv);
                }
              });
            };
            async.map(roles, checkRole, function (err, results) {
              // if any of the roles give the priv, then the user has the priv
              var result = _.reduce(results, function (memo, priv) {
                return priv || memo;
              }, false);
              if (err || !result) {
                callback({message: "_insufficientPrivileges"});
                return;
              }
              callback(); // success!
            });
          },
          error: function () {
            callback({message: "_restoreError"});
          }
        });
      },
      npmLoad = function (callback) {
        npm.load(callback);
      },
      npmInstall = function (callback) {
        npm.commands.install([extensionName], callback);
        npm.on("log", function (message) {
          // log the progress of the installation
          console.log(message);
        });
      },
      buildExtension = function (callback) {
        console.log("extension is", path.join(__dirname, "../../node_modules", extensionName));
        buildAll.build({
          database: database,
          extension: path.join(__dirname, "../../node_modules", extensionName)
        }, callback);
      };

    async.series([
      validateInput,
      validateUser,
      npmLoad,
      npmInstall,
      buildExtension
    ], function (err, results) {
      if (err) {
        console.log(err);
        err.isError = true;
        res.send(err);
        return;
      }
      console.log("all done");
      res.send({data: "_success!"});
    });
  };
}());


