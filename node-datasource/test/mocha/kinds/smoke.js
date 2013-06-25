/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    customerModel,
    itemSiteModel,
    assert = require("chai").assert;

  describe('Smoke test', function () {
    this.timeout(30 * 1000);

    //
    // We'll want to have TTOYS and BTRUCK/WH1 onhand and ready for the test to work.
    //
    before(function (done) {
      zombieAuth.loadApp(function () {
        customerModel = new XM.CustomerProspectRelation();
        customerModel.fetch({number: "TTOYS",
          success: function () {
            var itemSiteCollection = new XM.ItemSiteRelationCollection();
            itemSiteCollection.fetch({success: function () {
              itemSiteModel = _.find(itemSiteCollection.models, function (model) {
                return model.getValue("item.number") === "BTRUCK1" &&
                  model.getValue("site.code") === "WH1";
              });
              done();
            }});
          }
        });
      });
    });

    describe('User selects to create a sales order', function () {
      it('User navigates to Sales Order-New and selects to create a new Sales order', function (done) {
        var navigator = XT.app.$.postbooks.$.navigator,
          salesModuleIndex,
          prospectIndex,
          workspace,
          lineItemEditor;

        //
        // Drill down into the sales module
        //
        _.each(navigator.modules, function (module, index) {
          if (module.name === 'sales') {
            salesModuleIndex = index;
          }
        });
        assert.isDefined(salesModuleIndex, "The sales extension has not been loaded.");
        navigator.setModule(salesModuleIndex);

        //
        // Select the sales order list
        //
        _.each(navigator.modules[salesModuleIndex].panels, function (panel, index) {
          if (panel.kind === 'XV.SalesOrderList') {
            prospectIndex = index;
          }
        });
        assert.isDefined(prospectIndex, "The sales order list is not here.");
        navigator.setContentPanel(prospectIndex);

        //
        // Create a new record
        //
        navigator.newRecord();
        assert.isDefined(XT.app.$.postbooks.$.workspaceContainer);
        workspace = XT.app.$.postbooks.$.workspaceContainer.$.workspace;
        assert.isDefined(workspace);
        assert.equal(workspace.value.recordType, "XM.SalesOrder");

        //
        // Set the customer from the appropriate workspace widget
        //
        workspace.$.customerProspectWidget.doValueChange({value: customerModel});
        assert.equal(workspace.value.getValue("customer.number"), "TTOYS");
        assert.equal(workspace.value.get("shiptoCity"), "Walnut Hills");

        // In sales order, setting the line item fields will set off a series
        // of asynchronous calls. Once the "total" field is computed, we
        // know that the workspace is ready to save.
        // It's good practice to set this trigger *before* we change the line
        // item fields, so that we're 100% sure we're ready for the responses.
        workspace.value.on("change:total", function () {
          workspace.save({success: function (model, resp, options) {
            assert.equal(model.get("total"), 58.84);
            assert.equal(model.getStatus(), XM.Model.READY_CLEAN);
            done();
          }});
        });

        //
        // Set the line item fields
        //
        workspace.$.salesOrderLineItemBox.newItem();
        lineItemEditor = workspace.$.salesOrderLineItemBox.$.editor;
        lineItemEditor.$.itemSiteWidget.doValueChange({value: itemSiteModel});
        lineItemEditor.$.quantityWidget.doValueChange({value: 5});
      });
    });
  });
}());
