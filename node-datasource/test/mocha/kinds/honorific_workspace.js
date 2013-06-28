/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    smoke = require("../lib/smoke"),
    data = require("../models/honorific").data,
    assert = require("chai").assert;

  describe('Honorific Workspace', function () {
    this.timeout(30 * 1000);

    before(function (done) {
      zombieAuth.loadApp(done);
    });

    describe('User selects to create an honorific', function () {
      it('User navigates to Honorific-New and selects to create a new Honorific', function (done) {
        var workspace = smoke.navigateToNewWorkspace(XT.app, "XV.HonorificList");
        assert.equal(workspace.value.recordType, "XM.Honorific");
        smoke.setWorkspaceAttributes(workspace, data.createHash);
        smoke.saveAndVerify(workspace, done);
      });
    });
  });
}());
