/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true, before:true, module:true, require:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    customerModel,
    itemSiteModel,
    assert = require("chai").assert;

  describe('Smoke test', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      zombieAuth.loadApp(function () {
        customerModel = new XM.CustomerProspectRelation();
        customerModel.fetch({number: "TTOYS",
          success: function () {
            var itemSiteCollection = new XM.ItemSiteRelationCollection();
            itemSiteCollection.fetch({success: function () {
              itemSiteModel = _.find(itemSiteCollection.models, function (model) {
                return model.getValue("item.number") === "BPAINT1";
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
          prospectIndex;

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
        var workspace = XT.app.$.postbooks.$.workspaceContainer.$.workspace;
        assert.isDefined(workspace);
        assert.equal(workspace.value.recordType, "XM.SalesOrder");

        //
        // Set the values from the workspace widgets
        //
        workspace.$.customerProspectWidget.doValueChange({value: customerModel});
        assert.equal(workspace.value.getValue("customer.number"), "TTOYS");
        assert.equal(workspace.value.get("shiptoCity"), "Walnut Hills");
        workspace.$.salesOrderLineItemBox.newItem();

        var lineItemEditor = workspace.$.salesOrderLineItemBox.$.editor;
        lineItemEditor.$.itemSiteWidget.doValueChange({value: itemSiteModel});
        lineItemEditor.$.quantityWidget.doValueChange({value: 5});

        workspace.save({success: function (model, resp, options) {
          console.log("here!");

          done();
        }});
      });
    });
  });

}());
