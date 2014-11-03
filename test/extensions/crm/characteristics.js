/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true, expr: true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, beforeEach: true, afterEach: true, module:true,
  require:true, enyo:true, console:true, setTimeout:true,
  clearInterval:true, setInterval:true */

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
            // support masterref and postbooks
            return m.id === 'CONTACT-BIRTHDAY' || m.id === 'Birthday';
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
              assert.equal(model.get("characteristics").models[0].getStatusString(),
                "DESTROYED_DIRTY");

              model.on("statusChange", modelResaved);
              workspaceContainer.apply();
            }
          };

          model.on("statusChange", modelSaved);
          workspaceContainer.apply();
        });
      });


    });
    /**
    * Test INCDT-21540 fix
    */
    describe.skip('INCDT-21540: Characteristics appear editable when they shouldn\'t be',
        function () {
      var workspaceContainer, workspace, model, id, moduleContainer, originalPrivileges;

      beforeEach(function () {
        originalPrivileges = _.clone(XT.session.privileges.attributes);
      });

      it('test Characteristics widgets for enable/disable capability', function (done) {
        this.timeout(30 * 1000);

        smoke.navigateToExistingWorkspace(XT.app, "XV.IncidentList",
            function (_workspaceContainer) {
          workspaceContainer = _workspaceContainer;
          moduleContainer = XT.app.$.postbooks;


          workspace = workspaceContainer.$.workspace;
          id = workspace.getValue().id;
          model = workspace.getValue();

          _.each(
            _(workspaceContainer.$.workspace.$).filter(function (component) {
              return component.name.indexOf("Characteristic") !== -1;
            }),
            function (characteristic) {
              assert.isDefined(characteristic.getDisabled);
              assert.isFalse(characteristic.getDisabled());
            }
          );
          done();
        });
      });
      it('test with insufficent permissions: fields should be disabled', function (done) {
        this.timeout(30 * 1000);

        // revoke permissions
        _.each(XT.session.privileges.attributes, function (value, privilege) {
          if (/Maintain/.test(privilege) && /Incident/.test(privilege)) {
            XT.session.privileges.attributes[privilege] = false;
          }
        });

        smoke.navigateToExistingWorkspace(XT.app, "XV.IncidentList",
            function (_workspaceContainer) {
          workspaceContainer = _workspaceContainer;
          moduleContainer = XT.app.$.postbooks;

          workspace = workspaceContainer.$.workspace;
          id = workspace.getValue().id;
          model = workspace.getValue();

          var interval = setInterval(function () {
            // XXX this busy-guard should be folded into smoke
            if (!workspaceContainer.hasNode()) { return; }

            clearInterval(interval);
            _.each(
              _(workspaceContainer.$.workspace.$).filter(function (component) {
                return component.name.indexOf("Characteristic") !== -1;
              }),
              function (characteristic) {
                assert.isDefined(characteristic.getDisabled);
                assert.isTrue(
                  characteristic.getDisabled(),
                  "CharacteristicsWidget should be disabled."
                );

                // Verify that the "New" button is disabled.
                assert.isTrue(
                  characteristic.$.newButton.getDisabled(),
                  "Characteristic 'New' button should be disabled.");

                // Verify that each CharacteristicItem is disabled.
                _.each(
                  characteristic.$.repeater.controls,
                  function (item) {
                    assert.isTrue(
                      item.$.characteristicItem.getDisabled(),
                      item.$.characteristicItem.id + " should be disabled."
                    );
                  }
                );
              }
            );
            done();
          }, 100);
        });

      });
      afterEach(function (done) {
        this.timeout(30 * 1000);

        // restore permissions
        _.extend(XT.session.privileges.attributes, originalPrivileges);

        // maybe one of the tests already released the lock
        if (!model.hasLockKey()) {
          done();
          return;
        }
        model.on("lockChange", function () {
          model.off("lockChange");
          assert.isFalse(model.hasLockKey());

          setTimeout(function () {
            done();
          }, 5000);
        });
        workspaceContainer.close();
      });
    });
  });

}());
