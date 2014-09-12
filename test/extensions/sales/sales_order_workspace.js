/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true, setTimeout:true,
  console:true, before:true, after:true, module:true, require:true, setInterval:true,
  clearInterval:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    _ = require("underscore"),
    async = require("async"),
    submodels,
    smoke = require("../../lib/smoke"),
    assert = require("chai").assert,
    gridRow,
    gridBox,
    workspace,
    primeSubmodels = function (done) {
      var submodels = {};
      async.series([
        function (callback) {
          submodels.customerModel = new XM.SalesCustomer();
          submodels.customerModel.fetch({number: "TTOYS", success: function () {
            assert.equal(submodels.customerModel.get("shiptos").length, 3);
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

  // TODO: move to sales order spec
  describe.skip('Sales Order Workspace', function () {
    this.timeout(30 * 1000);

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
        smoke.navigateToNewWorkspace(XT.app, "XV.SalesOrderList", function (workspaceContainer) {
          workspace = workspaceContainer.$.workspace;

          assert.equal(workspace.value.recordType, "XM.SalesOrder");
          //
          // Set the customer from the appropriate workspace quantityWidget
          //
          var createHash = {
            customer: submodels.customerModel
          };
          // TODO: why is the first shipto getting stripped out of TTOYS by now?
          //assert.equal(submodels.customerModel.get("shiptos").length, 3);
          //assert.equal(submodels.customerModel.getDefaultShipto().getValue("address.city"), "Alexandoria");
          smoke.setWorkspaceAttributes(workspace, createHash);
          //assert.equal(workspace.value.getValue("shipto.address.city"), "Alexandria");
          // In sales order, setting the line item fields will set off a series
          // of asynchronous calls. Once the "total" field is computed, we
          // know that the workspace is ready to save.
          // It's good practice to set this trigger *before* we change the line
          // item fields, so that we're 100% sure we're ready for the responses.
          workspace.value.once("change:total", function () {
            done();
            /* The following save was moved to the second test
            smoke.saveWorkspace(workspace, function (err, model) {
              assert.isNull(err);
              // TODO: sloppy
              setTimeout(function () {
                smoke.deleteFromList(XT.app, model, done);
              }, 2000);
            });*/
          });

          //
          // Set the line item fields
          //
          // Be sure that there are no rows
          gridBox = workspace.$.salesOrderLineItemBox;
          assert.equal(gridBox.liveModels().length, 0);

          gridBox.newItem();
          gridRow = gridBox.$.editableGridRow;

          gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel, site: submodels.siteModel}});
          gridRow.$.quantityWidget.doValueChange({value: 5});

          // Verify that there is currently one row
          assert.equal(gridBox.liveModels().length, 1);
        });
      });
      it('adding a second line item should not copy the item', function (done) {
        workspace.value.once("change:total", done());

        gridRow.$.itemSiteWidget.$.privateItemSiteWidget.$.input.focus();
        // Add a new item, check that row exists, and make sure the itemSiteWidget doesn't copy irrelevantly
        gridBox.newItem();
        assert.equal(gridBox.liveModels().length, 2);
        assert.notEqual(submodels.itemModel.id, gridRow.$.itemSiteWidget.$.privateItemSiteWidget.$.input.value);

        // The intention was to delete the above line after verifying that the item doesn't copy but ran into
        // many issues so just populating with same data and saving it with 2 line items.
        gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel, site: submodels.siteModel}});
        gridRow.$.quantityWidget.doValueChange({value: 5});

        /* Delete the line item
        workspace.value.get("lineItems").models[1].destroy({
              success: function () {
                gridBox.setEditableIndex(null);
                gridBox.$.editableGridRow.hide();
                gridBox.valueChanged();
              }
            });
        */
      });
      it('deleting an item through SalesOrderLineWorkspace should remove it from the line item ' +
        'list', function (done) {
        var lineItemBox = workspace.$.salesOrderLineItemBox,
          model = lineItemBox.value.models[0],
          startModelLength = lineItemBox.liveModels().length,
          moduleContainer = XT.app.$.postbooks;

        /** Open the first model's salesOrderLineWorkspace...
            Copied from gridBox buttonTapped function (expandGridRowButton)
        */
        lineItemBox.doChildWorkspace({
          workspace: lineItemBox.getWorkspace(),
          collection: lineItemBox.getValue(),
          index: lineItemBox.getValue().indexOf(model)
        });

        /** The line item's workspace model has been deleted (DESTROYED_CLEAN).
            Client is now in SalesOrderWorkspace.
        */
        var statusChanged = function () {
          assert.notEqual(startModelLength, lineItemBox.liveModels().length);
          done();
        };

        model.once("status:DESTROYED_CLEAN", statusChanged);

        // Function to keep checking for notifyPopup showing and then tap yes.
        // This will fire right after the delete below.
        var notifyPopupInterval = setInterval(function () {
          if (!moduleContainer.$.notifyPopup.showing) { return; }
          clearInterval(notifyPopupInterval);
          moduleContainer.notifyTap(null, {originator: {name: "notifyYes" }});
        }, 100);
        // Delete the item in the workspace
        moduleContainer.getActive().deleteItem();
      });

      it('save, then delete order', function (done) {
        assert.isTrue((workspace.value.status === XM.Model.READY_DIRTY ||
          workspace.value.status === XM.Model.READY_NEW));
        smoke.saveWorkspace(workspace, function (err, model) {
          assert.isNull(err);
          // XXX - sloppy
          setTimeout(function () {
            smoke.deleteFromList(XT.app, model, done);
          }, 4000);
        }, true);
      });
    });
  });
}());
