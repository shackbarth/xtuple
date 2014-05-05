/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, exports:true, it:true, describe:true, XG:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    smoke = require("../lib/smoke"),
    zombieAuth = require("../lib/zombie_auth"),
    navigator,
    actList,
    moduleContainer;

  var spec = {
    recordType: "XM.ActivityListItem",
    collectionType: "XM.ActivityListItemCollection",
    cacheName: null,
    listKind: "XV.ActivityList",
    instanceOf: "XM.Model",
    isLockable: false,
    idAttribute: "uuid",
    attributes: ["uuid", "activityType", "activityAction", "editorKey", "parent", "name",
    "description", "status", "priority", "isActive", "startDate", "dueDate",
    "assignDate", "completeDate", "owner", "assignedTo"],
    skipSmoke: true,
    skipCrud: true
  };

  var additionalTests = function () {
    it("should navigate to activity list", function (done) {
      this.timeout(10000);
      navigator = smoke.navigateToList(XT.app, "XV.ActivityList");
      actList = navigator.$.contentPanels.getActive();
      moduleContainer = XT.app.$.postbooks;

      assert.equal(actList.kind, "XV.ActivityList");

      actList.value.once("status:READY_CLEAN", function () {
        done();
      });
    });

    it("should select first activity from the list, call reassignUser(), select user " +
      "from the popup picker and tap popup's OK to reassign the user", function (done) {
      this.timeout(40000);
      var model = actList.value.models[0],
        assignedTo = model.get("assignedTo") ? model.getValue("assignedTo.username") : null,
        newAssignedTo = assignedTo === "postgres" ? "admin" : "postgres",
        popup;

      // Select the first model from the list, call the reassignUser function
      actList.select(0);
      actList.reassignUser();
      // Verify the popup is displayed, set picker to new assigned to, tap Ok
      popup = moduleContainer.$.notifyPopup;
      assert.isTrue(popup.showing);
      popup.$.customComponent.setValue(newAssignedTo);
      assert.equal(popup.$.customComponent.$.pickerButton.content, newAssignedTo);
      moduleContainer.notifyTap(null, { originator: {name: "notifyYes"}});

      setTimeout(function () {
        assert.equal(actList.value.models[0].getValue("assignedTo.username"), newAssignedTo);
        done();
      }, 5000);
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
