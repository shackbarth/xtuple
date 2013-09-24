/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../../lib/zombie_auth"),
    smoke = require("../../lib/smoke"),
    assert = require("chai").assert;

  describe('Item Workspace', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('User selects to create an item', function () {
      it('User navigates to Item-New and selects to create a new Item', function (done) {
        this.timeout(30 * 1000);

        smoke.navigateToNewWorkspace(XT.app, "XV.ItemList", function (workspaceContainer) {
          var workspace = workspaceContainer.$.workspace;

          assert.equal(workspace.value.recordType, "XM.Item");
          smoke.setWorkspaceAttributes(workspace, require("../../lib/model_data").item);
          smoke.saveWorkspace(workspace, function () {
            smoke.deleteFromList(XT.app, workspace.value, done);
          });
        });
      });
    });
  });
}());

