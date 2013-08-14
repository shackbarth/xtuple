/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert,
    testData = [
      {kind: "XV.HonorificList", model: "XM.Honorific", update: "code"},
      {kind: "XV.AccountList", model: "XM.Account", update: "name"},
      {kind: "XV.OpportunityList", model: "XM.Opportunity", update: "name"},
      {kind: "XV.ContactList", model: "XM.Contact", update: "firstName"},
      {kind: "XV.ToDoList", model: "XM.ToDo", update: "notes"},
      {kind: "XV.IncidentList", model: "XM.Incident", update: "notes"}
    ];

  describe('Honorific Workspace', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('User selects to create an honorific', function () {
      it('User navigates to Honorific-New and selects to create a new Honorific', function (done) {
        this.timeout(30 * 1000);
        var code = "Herr" + Math.random(),
          workspace = smoke.navigateToNewWorkspace(XT.app, "XV.HonorificList");

        assert.equal(workspace.value.recordType, "XM.Honorific");
        smoke.setWorkspaceAttributes(workspace, {code: code});
        smoke.saveWorkspace(workspace, function () {
          smoke.deleteFromList(XT.app, code, done);
        });
      });
      _.each(testData, function (test) {
        it('should allow update to the first element of ' + test.kind, function (done) {
          this.timeout(30 * 1000);
          smoke.navigateToExistingWorkspace(XT.app, test.kind, function (workspace) {
            var updateObj;
            assert.equal(workspace.value.recordType, test.model);
            if (typeof test.update === 'string') {
              updateObj = {};
              updateObj[test.update] = "Test" + Math.random();
            } else if (typeof test.update === 'object') {
              updateObj = test.update;
            }

            smoke.setWorkspaceAttributes(workspace, updateObj);
            smoke.saveWorkspace(workspace, done);
          });
        });
      });
    });
  });
}());
