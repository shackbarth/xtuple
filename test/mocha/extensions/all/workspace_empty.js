/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    zombieAuth = require("../../lib/zombie_auth"),
    smoke = require("../../lib/smoke");

  describe('Workspaces', function () {
    this.timeout(30 * 1000);

    before(function (done) {
      zombieAuth.loadApp(done);
    });

    it('should fail predictably when appropriate', function () {
      this.timeout(30 * 1000);
      var navigator = XT.app.$.postbooks.$.navigator,
        workspace;

      _.each(navigator.modules, function (module, moduleIndex) {
        _.each(module.panels, function (panel, panelIndex) {
          var listName = XT.app.$.postbooks.modules[moduleIndex].panels[panelIndex].name,
            list;

          // describe("The workspace for " + listName, function () {
          //   it('should fail predictably if we save it with no data', function (done) {
          //     this.timeout(30 * 1000);

          //     console.log(listName);
          //     console.log(moduleIndex);
          //     console.log(panelIndex);

          //     navigator.setModule(moduleIndex);
          //     navigator.setContentPanel(panelIndex);
          //     list = navigator.$.contentPanels.getActive();
          //     if (!(list instanceof XV.List)) {
          //       // don't test the welcome page, dashboards, etc.
          //       done();
          //       return;
          //     } else if (!list.getValue().model.canCreate && !list.getValue().model.couldCreate) {
          //       // don't test the configuration list, etc.
          //       done();
          //       return;
          //     } else if (list.getValue().model.couldCreate && !list.getValue().model.couldCreate()) {
          //       // don't test ShipmentList or others that disallow creation
          //       done();
          //       return;
          //     } else if (!list.getValue().model.couldCreate && !list.getValue().model.canCreate()) {
          //       // don't test ShipmentList or others that disallow creation
          //       done();
          //       return;
          //     }
          //     navigator.newRecord({}, {originator: {}});
          //     workspace = XT.app.$.postbooks.getActive().$.workspace;
          //     smoke.saveWorkspace(workspace, function (err, model) {
          //       assert.isNotNull(err);
          //       assert.isString(err.code);
          //       done();
          //     }, true);
          //   });
          // });
        });
      });
    });
  });
}());
