/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, XM:true, XG:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    common = require("../lib/common"),
    zombieAuth = require("../lib/zombie_auth"),
    smoke = require("../lib/smoke"),
    printer = require("../specs/printer");

  describe("User Preference workspace", function () {
    var workspace, model, newPrinterModel;
    this.timeout(50 * 1000);
    before(function (done) {
      zombieAuth.loadApp(done);
    });

    printer.spec.captureObject = true;
    smoke.runUICrud(printer.spec);

    it("opens the workspace", function (done) {
      XT.app.$.postbooks.$.navigator.doWorkspace({
        workspace: "XV.UserPreferenceWorkspace",
        id: false,
        success: function () {
          workspace = XT.app.$.postbooks.getActive().$.workspace;
          model = workspace.value;
          assert.equal(workspace.kind, "XV.UserPreferenceWorkspace");
          done();
        }
      });
    });

    it("there should be PrintPickers components for each of the printableObjects", function () {
      // The 2 arrays should be the same. _.keys(XM.printableObject) = [ "SalesOrder", "Invoice",
      // "PurchaseOrder", "Location", "EnterReceipt", "Shipment" ]
      assert.isTrue(_.isEmpty(_.difference(_.keys(XM.printableObjects), _.keys(workspace.$))));

      // Cycle through each of the PrintPickers and check:
      _.each(_.keys(XM.printableObjects), function (key) {
        assert.equal(model.getValue(key), "Browser"); // ea. Picker set to Browser
        // XXX- replace 'EnterReceipt' with 'key'
        assert.equal(workspace.$.EnterReceipt.getCollection(), "XM.printers");
        assert.equal(workspace.$.EnterReceipt.filteredList().length, XM.printers.length);
      });
    });

    it("the newly created printer should be in the picker list", function (done) {
      newPrinterModel = _.find(workspace.$.EnterReceipt.value.collection.models, function (model) {
        return model.id === XG.capturedId;
      });
      assert.isDefined(newPrinterModel);
      XT.app.$.postbooks.getActive().doPrevious(); // XXX - not happening!!
      setTimeout(function () {
        assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
        done();
      }, 4000);
    });

    it.skip("set the PrintPicker widget to the newly created Printer and save", function (done) {
      // Change picker and save
      workspace.value.once("status:READY_DIRTY", function () {
        XT.app.$.postbooks.getActive().saveAndClose({force: true});
        setTimeout(function () {
          // This is not happening
          assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
          done();
        }, 5000);
      });
      workspace.$.EnterReceipt.setValue(newPrinterModel);
    });

    it.skip("query the db to check saved User Preference Printer setting", function (done) {
      // TODO
    });
  });
}());

