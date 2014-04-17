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

  describe('Activity list', function () {
    var postbooks;
    this.timeout(40 * 1000);

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    it("should navigate to activity list", function () {
      smoke.navigateToList(XT.app, "XV.ActivityList");
    });

    it("should select first activity from the list, select reassign, select 'postgres' user " +
      "from the popup picker and click ok to reassign the user", function (done) {
      var actList = XT.app.$.postbooks.$.navigator.$.contentPanels.getActive(),
        assignedTo;
      assert.equal(actList.kind, "XV.ActivityList");
      
      if (actList.value.status === XM.Model.READY_CLEAN) {
        var model = actList.value.models[0],
          popup;

        assignedTo = model.get("assignedTo") ? model.getValue("assignedTo.username") : null;
        actList.select(0);
        actList.reassignUser();

        popup = XT.app.$.postbooks.$.notifyPopup;
        popup.$.customComponent.$.pickerButton.setContent("postgres");
        assert.equal(popup.$.customComponent.$.pickerButton.content, "postgres");
        XT.app.$.postbooks.notifyTap(null, { originator: {name: "notifyOK"}});

        setTimeout(function () {
          assert.equal(actList.value.models[0].getValue("assignedTo.username"), "postgres");
        }, 3000);
        
        done();
      }

    });

  });

}());
