/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, require:true */

(function () {
  "use strict";

  /*
    Does any need prep-work to the database. Currently, this is just to add
    the privileges to the test user.
  */


  var async = require("async"),
    _ = require("underscore"),
    loginData = require('./login_data'),
    username = loginData.data.username,
    privNames = ["MaintainSaleTypes", "MaintainProjectTypes", "MaintainSalesEmailProfiles"];

  var assignmentModels;
  var initAssignmentModel = function (privName, callback) {
    var assignmentModel = new XM.UserAccountPrivilegeAssignment();
    assignmentModel.on("change:uuid", function () {
      assignmentModel.privName = privName;
      callback(null, assignmentModel);
    });
    assignmentModel.initialize(null, {isNew: true});
  };
  var initAssignmentModels = function (callback) {
    async.map(privNames, initAssignmentModel, function (err, results) {
      assignmentModels = results;
      callback();
    });
  };

  var userModel;
  var fetchUserModel = function (callback) {
    var statusChanged = function () {
      if (userModel.isReady()) {
        userModel.off("statusChange", statusChanged);
        callback();
      }
    };
    userModel = new XM.UserAccount();
    userModel.on("statusChange", statusChanged);
    userModel.fetch({username: username});
  };

  var saveUserPrivs = function (callback) {
    _.each(assignmentModels, function (assignmentModel) {
      var priv,
        preExistingPriv = _.filter(userModel.get("grantedPrivileges").models, function (model) {
          return model.getValue("privilege.name") === assignmentModel.privName;
        });
      if (preExistingPriv.length > 0) {
        // no need to add it
        return;
      }
      priv = _.find(XM.privileges.models, function (priv) {
        return priv.id === assignmentModel.privName;
      });

      // okay, add the privilege
      assignmentModel.set({privilege: priv});
      userModel.get("grantedPrivileges").add(assignmentModel);

      // update the client, too
      var setObj = {};
      setObj[assignmentModel.privName] = true;
      XT.session.privileges.set(setObj);
    });

    if (!userModel.isDirty()) {
      // no privs to set
      callback();
      return;
    }

    userModel.save(null, {success: function () {
      callback();
    }});
  };

  var prepDatabase = function (callback) {
    async.series([
      initAssignmentModels,
      fetchUserModel,
      saveUserPrivs
    ], callback);
  };

  exports.prepDatabase = prepDatabase;

}());

