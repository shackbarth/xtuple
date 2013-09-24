/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true,
  beforeEach:true, afterEach:true, setTimeout:true, setInterval:true,
  clearInterval:true*/

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    _ = require("underscore"),
    smoke = require("../../lib/smoke"),
    common = require("../../lib/common"),
    assert = require("chai").assert;

  describe('Workspaces', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should be plumbed correctly', function () {
      // look at all the workspaces in XV
      _.each(XV, function (value, key) {
        if (XV.inheritsFrom(value.prototype, "XV.Workspace")) {
          if (_.contains(['SalesOrderBase', 'AccountDocumentWorkspace', 'OrderedReferenceWorkspace'], key) ||
              value.prototype.modelAmnesty) {
            // exclude abstract classes and child workspaces
            return;
          }

          describe('XV.' + key, function () {
            it('should reflect well in the history panel', function () {
              var master = new enyo.Control(),
                Klass,
                workspace = master.createComponent({kind: "XV." + key});

              if (workspace.model) {
                Klass = XT.getObjectByName(workspace.model);
                assert.isNotNull(Klass);
                if (Klass.prototype.getAttributeNames().indexOf(Klass.prototype.nameAttribute) < 0 &&
                    typeof Klass.prototype[Klass.prototype.nameAttribute] !== 'function' &&
                    Klass.prototype.idAttribute === 'uuid') {
                  assert.fail(0, 1, workspace.model + " does not contain its nameAttribute, which will reflect " +
                    "poorly in the history panel");
                }
              }
            });

            it('should have its attrs set up right', function () {
              var master = new enyo.Control(),
                workspace = master.createComponent({kind: "XV." + key});

              var attrs = _.compact(_.map(workspace.$, function (component) {
                return component.attr;
              }));
              _.each(attrs, function (attr) {
                common.verifyAttr(attr, workspace.model);
              });
            });
          });
        }
      });
    });
  });
  /**
   * Test INCDT-21540 fix
   */
  describe('INCDT-21540: Characteristics appear editable when they shouldn\'t be', function () {
    var workspaceContainer, workspace, model, id, moduleContainer, originalPrivileges;

    beforeEach(function () {
      originalPrivileges = _.clone(XT.session.privileges.attributes);
    });

    it('test Characteristics widgets for enable/disable capability', function (done) {
      this.timeout(30 * 1000);

      smoke.navigateToExistingWorkspace(XT.app, "XV.IncidentList", function (_workspaceContainer) {
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

      smoke.navigateToExistingWorkspace(XT.app, "XV.IncidentList", function (_workspaceContainer) {
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
      this.timeout(10 * 1000);

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

  /**
    * Test the INCDT-21110 fix.
    * http://www.xtuple.org/xtincident/view/default/21110
    */
  describe('INCDT-21110: Record remains locked when Back->Discard selected', function () {
    var workspaceContainer, workspace, model, id, moduleContainer;

    beforeEach(function (done) {
      this.timeout(10 * 1000);

      smoke.navigateToExistingWorkspace(XT.app, "XV.ClassCodeList", function (_workspaceContainer) {
        workspaceContainer = _workspaceContainer;
        moduleContainer = XT.app.$.postbooks;
        assert.equal(workspaceContainer, XT.app.$.postbooks.getActive());

        workspace = workspaceContainer.$.workspace;
        id = workspace.getValue().id;
        model = workspace.getValue();

        assert.isTrue(model.hasLockKey(), "model should have lock");
        assert.isFalse(model.isNew());

        done();
      });
    });
    afterEach(function (done) {
      this.timeout(10 * 1000);

      // maybe one of the tests already released the lock
      if (!model.hasLockKey()) {
        done();
        return;
      }
      model.on("lockChange", function () {
        model.off("lockChange");
        assert.isFalse(model.hasLockKey());
        // XXX solves inexplicable race condition
        setTimeout(function () {
          done();
        }, 4000);
      });
      workspaceContainer.close();
    });
    it('test base case', function () {

    });
    it('test lock condition on "close and discard"', function (done) {
        /**
          * This test presupposes that we have obtained the lock. When the
          * lock has been released, the test completes.
          */
      var handleLockChange = function () {
          model.off("lockChange", handleLockChange);
          assert.isFalse(model.hasLockKey());
          done();
        },
        /**
          * Guard on notifyPopup; when the notifyPopup is showing, 'tap' the
          * popup's "Discard" button.
          */
        notifyPopupInterval = setInterval(function () {
          if (!moduleContainer.$.notifyPopup.showing) { return; }

          clearInterval(notifyPopupInterval);
          model.on("lockChange", handleLockChange);
          moduleContainer.notifyTap(null, { originator: { name: "notifyNo" }});
        }, 100),
        /**
          * When the model is READY_CLEAN, edit the value of inputWidget
          */
        handleBeforeEdit = function () {
          if (model.isDirty()) { return; }

          model.off("statusChange", handleBeforeEdit);
          workspace.$.inputWidget.setValue("a valid name");
        },
        /**
          * When the model becomes dirty as a result of the edit, 'tap' the
          * container's "Back" button.
          */
        handleAfterEdit = function () {
          if (!model.isDirty()) { return; }

          model.off("statusChange", handleAfterEdit);
          workspaceContainer.$.backButton.bubble("onclick");
        };

      model.on("statusChange", handleBeforeEdit);
      model.on("statusChange", handleAfterEdit);
    });
  });
}());
