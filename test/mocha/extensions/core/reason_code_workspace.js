/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../../lib/zombie_auth"),
    modelData = require("../../lib/model_data"),
    smoke = require("../../lib/smoke"),
    assert = require("chai").assert;

  describe('Reason Code Workspace', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('User selects to create a reason code', function () {
      it('User navigates to Reason Code-New and selects to create a new Reason Code', function (done) {
        this.timeout(30 * 1000);
        smoke.navigateToNewWorkspace(XT.app, "XV.ReasonCodeList", function (workspaceContainer) {
          var workspace = workspaceContainer.$.workspace;

          assert.equal(workspace.value.recordType, "XM.ReasonCode");
          smoke.setWorkspaceAttributes(workspace, modelData.honorific);
          smoke.saveWorkspace(workspace, function () {
            smoke.deleteFromList(XT.app, workspace.value, done);
          });
        });
      });
    });
  });
}());