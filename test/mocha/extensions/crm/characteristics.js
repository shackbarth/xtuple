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
        smoke.navigateToNewWorkspace(XT.app, "XV.ContactList", function (workspaceContainer) {

          var workspace = workspaceContainer.$.workspace,
            model = workspace.value,
            charWidget,
            charModel,
            contactCharModel;

          assert.equal(model.recordType, "XM.Contact");
          smoke.setWorkspaceAttributes(workspace, modelData.contact);

          //
          // Add a characteristic
          //
          assert.equal(model.get("characteristics").length, 0);
          charWidget = workspace.$.contactCharacteristicsWidget;
          charWidget.newItem();
          // XXX it'd be better to do this through enyo
          charModel = _.find(XM.characteristics.models, function (m) {
            return m.id === 'Birthday';
          });
          assert.isObject(charModel);
          contactCharModel = charWidget.value.models[0];
          contactCharModel.set({
            characteristic: charModel,
            value: "Tuesday"
          });

          //
          // On the second save: exit
          //
          var modelResaved = function (m, status) {
            if (status === XM.Model.READY_CLEAN) {
              model.off("statusChange", modelResaved);
              workspaceContainer.close();

              setTimeout(function () {
                assert(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
                done();
              }, 5000);

            }
          };

          //
          // On the first save: try deleting the characteristic and resaving
          //
          var modelSaved = function (m, status) {
            var charItem, picker, deleteItem;

            if (status === XM.Model.READY_CLEAN) {
              model.off("statusChange", modelSaved);
              assert.equal(model.get("characteristics").length, 1);

              charItem = charWidget.$.repeater.children[0].$.characteristicItem;
              assert.isObject(charItem);

              picker = charItem.$.characteristicPicker.$.picker;
              deleteItem = _.find(picker.$, function (item) {
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
        });
      });


    });
  });

}());
