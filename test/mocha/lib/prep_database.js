/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, require:true */

(function () {
  "use strict";

  /*
    Does any need prep-work to the database. Currently, this is just to add
    the MaintainSaleTypes privilege to admin. This can be generalized lot
    if we want to do more stuff in here.
  */


  var async = require("async"),
    _ = require("underscore"),
    loginData = require('../../shared/login_data');

  var adminName = loginData.data.username;
  var privName = "MaintainSaleTypes"; // TODO: support array

  var assignmentModel;
  var initAssignmentModel = function (callback) {
    assignmentModel = new XM.UserAccountPrivilegeAssignment();
    assignmentModel.on("change:uuid", function () {
      callback();
    });
    assignmentModel.initialize(null, {isNew: true});
  };

  var adminModel;
  var fetchAdminModel = function (callback) {
    var statusChanged = function () {
      if (adminModel.isReady()) {
        adminModel.off("statusChange", statusChanged);
        callback();
      }
    };
    adminModel = new XM.UserAccount();
    adminModel.on("statusChange", statusChanged);
    adminModel.fetch({username: adminName});
  };

  var saveAdminPrivs = function (callback) {
    var priv = _.find(XM.privileges.models, function (priv) {
      return priv.id === privName;
    });
    var preExistingPriv = _.filter(adminModel.get("grantedPrivileges").models, function (model) {
      return model.getValue("privilege.name") === privName;
    });
    if (preExistingPriv.length > 0) {
      // no need to add it
      return callback();
    }

    // okay, add the privilege
    assignmentModel.set({privilege: priv});
    adminModel.get("grantedPrivileges").add(assignmentModel);
    adminModel.save(null, {success: function () {
      var preExistingPriv = _.filter(adminModel.get("grantedPrivileges").models, function (model) {
        return model.getValue("privilege.name") === privName;
      });
      callback();
    }});
  };

  var prepDatabase = function (callback) {
    async.series([
      initAssignmentModel,
      fetchAdminModel,
      saveAdminPrivs
    ], callback);
  };

  exports.prepDatabase = prepDatabase;

}());

