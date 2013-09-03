/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  console:true, before:true, after:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    async = require("async"),
    submodels,
    smoke = require("../lib/smoke"),
    assert = require("chai").assert,
    primeSubmodels = function (done) {
      var submodels = {};
      async.series([
        function (callback) {
          submodels.customerModel = new XM.SalesCustomer();
          submodels.customerModel.fetch({number: "TTOYS", success: function () {
            callback();
          }});
        },
        function (callback) {
          submodels.itemModel = new XM.ItemRelation();
          submodels.itemModel.fetch({number: "BTRUCK1", success: function () {
            callback();
          }});
        },
        function (callback) {
          submodels.siteModel = new XM.SiteRelation();
          submodels.siteModel.fetch({code: "WH1", success: function () {
            callback();
          }});
        }
      ], function (err) {
        done(err, submodels);
      });
    };

  describe('Sales Order Workspace', function () {
    this.timeout(20 * 1000);

    //
    // We'll want to have TTOYS, BTRUCK1, and WH1 onhand and ready for the test to work.
    //
    before(function (done) {
      zombieAuth.loadApp(function () {
        primeSubmodels(function (err, submods) {
          submodels = submods;
          done();
        });
      });
    });

    describe('User selects to create a sales order', function () {
      it('User navigates to Sales Order-New and selects to create a new Sales order', function (done) {
        var gridRow;

        var workspace = smoke.navigateToNewWorkspace(XT.app, "XV.SalesOrderList");
        assert.equal(workspace.value.recordType, "XM.SalesOrder");

        //
        // Set the customer from the appropriate workspace widget
        //
        var createHash = {
          customer: submodels.customerModel
        };
        smoke.setWorkspaceAttributes(workspace, createHash);
        assert.equal(workspace.value.get("shiptoCity"), "Walnut Hills");
        // In sales order, setting the line item fields will set off a series
        // of asynchronous calls. Once the "total" field is computed, we
        // know that the workspace is ready to save.
        // It's good practice to set this trigger *before* we change the line
        // item fields, so that we're 100% sure we're ready for the responses.

        workspace.value.on("statusChange", function (model, status) {
          if (status === XM.Model.DESTROYED_DIRTY) {
            done();
          }
        });
        workspace.value.on("change:total", function () {
          smoke.saveWorkspace(workspace, function (err, model) {
            assert.isNull(err);
            smoke.deleteFromList(XT.app, model.id, done);
          });
        });

        //
        // Set the line item fields
        //
        workspace.$.salesOrderLineItemGridBox.newItem();
        gridRow = workspace.$.salesOrderLineItemGridBox.$.editableGridRow;
        gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel, site: submodels.siteModel}});
        gridRow.$.quantityWidget.doValueChange({value: 5});
      });
    });
  });
}());
