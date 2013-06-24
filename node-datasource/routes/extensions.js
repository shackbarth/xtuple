/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

var async = require("async");

(function () {
  "use strict";

  /**
    @name Extensions
    @class Extensions
    Returns a list of extensions associated with an organization.
   */
  exports.extensions = function (req, res) {
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
            res.send({data: extensions});
          });

        } else {
          // no second async call necessary
          res.send({data: extensions});
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
