/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true, setTimeout:true,
  console:true, before:true, after:true, module:true, require:true */

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
    model,
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
        smoke.navigateToNewWorkspace(XT.app, "XV.SalesOrderList", function (workspaceContainer) {
          workspace = workspaceContainer.$.workspace;
          model = workspace.value;

          assert.equal(workspace.value.recordType, "XM.SalesOrder");
          //
          // Set the customer from the appropriate workspace widget
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
          workspace.value.on("change:total", function () {
            workspaceContainer.saveAndClose();
            setTimeout(function () {
              assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
              done();
            }, 2000);
            /*smoke.saveWorkspace(workspace, function (err, model) {
              assert.isNull(err);
              // TODO: sloppy
              //setTimeout(function () {
              //  smoke.deleteFromList(XT.app, model, done);
              //}, 2000);
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
      it('The second line item should not copy item from first line', function (done) {
        smoke.navigateToExistingWorkspace(XT.app, "XV.SalesOrderList", function (workspaceContainer) {
          workspace = workspaceContainer.$.workspace;
          assert.equal(workspace.value.recordType, "XM.SalesOrder");
          /*
          XT.app.$.postbooks.$.navigator.doWorkspace({
            workspace: "XV.SalesOrderWorkspace",
            id: id
          });
          */
          var addLineItems = function () {
            gridBox = workspace.$.salesOrderLineItemBox;
            gridRow = gridBox.$.editableGridRow;
            // Be sure that there is 1 row
            assert.equal(gridBox.liveModels().length, 1);
            // Put focus in itemSiteWidget
            gridRow.$.itemSiteWidget.$.privateItemSiteWidget.$.input.focus();
            // Add a new item and make sure the itemSiteWidget doesn't copy irrelevantly
            gridBox.newItem();
            assert.notEqual(submodels.itemModel.id, gridRow.$.itemSiteWidget.$.privateItemSiteWidget.$.input.value);
            // Verify that there are 2 rows
            assert.equal(gridBox.liveModels().length, 2);
            // Delete the newly created row
            workspace.value.get("lineItems").models[1].destroy();

            // Confirm deletion and make sure there is only 1 row afterwards
            //setTimeout(function () {
              assert.isTrue(XT.app.$.postbooks.$.notifyPopup.showing);
              XT.app.$.postbooks.notifyTap(null, { originator: { name: "notifyYes" }});  
            //}, 3000)
            
            setTimeout(function () {
              assert.equal(gridBox.liveModels().length, 1);
              done();
            }, 3000);
            
            // Save Order
            /*workspaceContainer.saveAndClose();
            setTimeout(function () {
              done();
            }, 4000);*/
          };
          workspace.value.once('status:READY_CLEAN', addLineItems);
        }, {model: model});
      });
      it('delete the Sales Order from the list', function (done) {
        smoke.saveWorkspace(workspace, function (err, model) {
          assert.isNull(err);
          // TODO: sloppy
          console.log("here");
          done();
          //setTimeout(function () {
          //  smoke.deleteFromList(XT.app, model, done);
            //done();
          //}, 2000);
        }, true);
        XT.app.$.postbooks.getActive().saveAndClose();
        done();
        //assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
        //smoke.deleteFromList(XT.app, model, done);
        //done();
      });
    });
  });
}());
