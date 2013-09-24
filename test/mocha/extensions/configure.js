/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true, setTimeout:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    zombieAuth = require("../lib/zombie_auth"),
    async = require("async"),
    smoke = require("../lib/smoke");

  describe('Configuration Workspaces', function () {
    this.timeout(30 * 1000);

    before(function (done) {
      zombieAuth.loadApp(done);
    });

    it('should all be accessible', function (done) {
      this.timeout(30 * 1000);
      var navigator,
        list,
        i = -1;

      smoke.navigateToList(XT.app, "XV.ConfigurationsList");
      navigator = XT.app.$.postbooks.$.navigator;
      list = navigator.$.contentPanels.getActive();
      assert.equal(list.value.length, 5);
      async.mapSeries(list.value.models, function (listItem, callback) {
        var workspaceContainer;

        i++;
        list.itemTap({}, {index: i});
        workspaceContainer = XT.app.$.postbooks.getActive();
        assert.equal(workspaceContainer.kind, "XV.WorkspaceContainer");
        workspaceContainer.close();
        setTimeout(function () {
          assert.equal(XT.app.$.postbooks.getActive(), "XV.Navigator");
          callback();
        }, 3000);
      }, function (err, result) {
        assert.isNull(err);
        done();
      });
    });
  });
}());

