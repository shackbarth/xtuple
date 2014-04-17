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
    utils = 1;

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
    describe("Activity List actions", function () {
      this.timeout(40000);
      it("should navigate to activity list", function () {
        smoke.navigateToList(XT.app, "XV.ActivityList");
      });

      it("should select first activity from the list, select reassign, select 'postgres' user " +
        "from the popup picker and click ok to reassign the user", function (done) {
        var actList = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive(),
          assignedTo,
          moduleContainer = XT.app.$.postbooks;
        
        assert.equal(actList.kind, "XV.ActivityList");
        
        if (actList.value.status === XM.Model.READY_CLEAN) {
          var model = actList.value.models[0],
            popup;

          assignedTo = model.get("assignedTo") ? model.getValue("assignedTo.username") : null;
          actList.select(0);
          actList.reassignUser();
          
          setTimeout(function () {
            popup = moduleContainer.$.notifyPopup;
            assert.isTrue(popup.showing);
            popup.$.customComponent.$.pickerButton.setContent("postgres");
            moduleContainer.notifyTap(null, { originator: {name: "notifyYes"}});
          }, 3000);
            
          setTimeout(function () {
            console.log("here6");
            assert.equal(actList.value.models[0].getValue("assignedTo.username"), "postgres");
            done();
          }, 5000);
          console.log("here7");
        }
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
