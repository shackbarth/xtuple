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
        var newModel = workspace.value; // TODO: get this off the list
        smoke.setWorkspaceAttributes(workspace, data.createHash);
        smoke.saveWorkspace(workspace, function () {
          XT.app.$.postbooks.previous();
          var list = XT.app.$.postbooks.getActive().$.contentPanels.getActive();
          // TODO: wait for the list to refresh?
          //var newModel = _.find(list.value.models, function (model) {
          //  console.log(model.get("code"), data.createHash.code);
          //  return model.get("code") === data.createHash.code;
          //});
          newModel.on("statusChange", function (model, status) {
            if (status === XM.Model.DESTROYED_DIRTY) {
              done();
            }
          });
          // TODO: deal with infomodel/editablemodel
          list.deleteItem({model: newModel});
        });
      });
    });
  });
}());
