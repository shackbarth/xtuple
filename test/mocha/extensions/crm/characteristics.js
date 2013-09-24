/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true, expr: true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, beforeEach: true, afterEach: true, module:true,
  require:true, enyo:true, console:true, setTimeout:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../../lib/zombie_auth"),
    smoke = require("../../lib/smoke"),
    common = require("../../lib/common"),
    modelData = require("../../lib/model_data"),
    assert = require("chai").assert;

  describe('Characteristics widgets', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe(' ', function () {
      it('should be possible to add one', function (done) {
        this.timeout(30 * 1000);
        var workspaceContainer = smoke.navigateToNewWorkspace(XT.app, "XV.ContactList"),
          workspace = workspaceContainer.$.workspace,
          model = workspace.value;

        var setAndSave = function () {
          if (model.id) {
            model.off("change:number", setAndSave);
            assert.equal(model.recordType, "XM.Contact");
            smoke.setWorkspaceAttributes(workspace, modelData.contact);

            //
            // Add a characteristic
            //
            assert.equal(model.get("characteristics").length, 0);
            var charWidget = workspace.$.contactCharacteristicsWidget;
            charWidget.newItem();
            // XXX it'd be better to do this through enyo
            var charModel = _.find(XM.characteristics.models, function (m) {
              return m.id === 'Birthday';
            });
            assert.isObject(charModel);
            var contactCharModel = charWidget.value.models[0];
            contactCharModel.set({
              characteristic: charModel,
              value: "Tuesday"
            });


            var modelResaved = function (m, status) {
              if (status === XM.Model.READY_CLEAN) {
                model.off("statusChange", modelResaved);
                done();

              }
            };


            var modelSaved = function (m, status) {
              if (status === XM.Model.READY_CLEAN) {
                model.off("statusChange", modelSaved);
                assert.equal(model.get("characteristics").length, 1);

                var charItem = charWidget.$.repeater.children[0].$.characteristicItem;
                assert.isObject(charItem);

                var picker = charItem.$.characteristicPicker.$.picker;
                var deleteItem = _.find(picker.$, function (item) {
                  return item.value === null;
                });
                assert.isFunction(deleteItem.tap);
                deleteItem.tap();
                assert.equal(model.get("characteristics").models[0].getStatusString(), "DESTROYED_DIRTY");

                model.on("statusChange", modelResaved);
                workspaceContainer.apply();
              }
            };

            model.on("statusChange", modelSaved);
            workspaceContainer.apply();
            /*
            smoke.saveWorkspace(workspace, function () {
              smoke.deleteFromList(XT.app, workspace.value, done);
            });
            */
          }
        };
        setAndSave();
        workspace.value.on("change:number", setAndSave);
      });


    });
  });

}());
