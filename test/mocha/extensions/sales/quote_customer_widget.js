/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  setTimeout:true, console:true, before:true, after:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    _ = require("underscore"),
    async = require("async"),
    smoke = require("../../lib/smoke"),
    assert = require("chai").assert;

  describe('Quote Workspace', function () {
    this.timeout(20 * 1000);

    //
    // We'll want to have TTOYS, BTRUCK1, and WH1 onhand and ready for the test to work.
    //
    before(function (done) {
      zombieAuth.loadApp(done);
    });

    describe('Customer Prospect Widget', function () {
      it('should allow users to create a new customer', function (done) {
        var quoteWorkspace = smoke.navigateToNewWorkspace(XT.app, "XV.QuoteList"),
          customerWorkspace;

        assert.equal(quoteWorkspace.value.recordType, "XM.Quote");

        //quoteWorkspace.$.customerWidget.$.customerButton.tap({});
        quoteWorkspace.$.customerWidget.popupTapped({}, {originator: {name: "customerButton"}});
        customerWorkspace = XT.app.$.postbooks.getActive().$.workspace;
        assert.equal(customerWorkspace.kind, "XV.CustomerWorkspace");

        smoke.setWorkspaceAttributes(customerWorkspace, require("../../lib/model_data").customer);
        assert.isUndefined(customerWorkspace.value.validate(customerWorkspace.value.attributes));
        XT.app.$.postbooks.getActive().saveAndClose();
        setTimeout(function () { // yeah yeah yeah
          assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.QuoteWorkspace");
          assert.equal(quoteWorkspace.value.getValue("customer.name"), "TestCust");
          XT.app.$.postbooks.getActive().close({force: true});
          done();
        }, 3000);

        /*
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
        */
      });
    });
  });
}());

