/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth"),
    smoke = require("../lib/smoke"),
    crud = require("../lib/crud"),
    modelData = require("../lib/model_data"),
    assert = require("chai").assert;

  describe('Issue to Shipping Transaction', function () {
    //this.timeout(20 * 1000);
    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });
    /*
    it('Using CRUD to create a new sales order', function () {
      var salesOrderData = modelData.salesOrderData;
      salesOrderData.skipDelete = true;
      crud.runAllCrud(modelData.salesOrderData);
      it('should have the sales order', function () {
        assert.isString(salesOrderData.model.id);
      });
    });
    */

    it('User navigates to Issue to Shipping', function (done) {
      smoke.navigateToList(XT.app, "XV.ShipmentList");
      XT.app.$.postbooks.issueToShipping();
      var transactionList = XT.app.$.postbooks.getActive();
      setTimeout(function () {
        assert.equal(transactionList.kind, "XV.IssueToShipping");
      }, 2000);

      //var myOriginator = transactionList.$.parameterWidget.$.order.$.input.$.searchItem;
      //var myEvent = {originator: myOriginator};
      //transactionList.$.parameterWidget.$.order.$.input.itemSelected(null, myEvent);
      var orderNumber = "50271";
      transactionList.$.parameterWidget.$.order.setValue(orderNumber);
      
      var list = XT.app.$.postbooks.getActive().$.list;
      assert.equal(list, "XV.IssueToShippingList");
      setTimeout(function () {
        assert.equal(transactionList.model.id, orderNumber);
      }, 2000);
      assert.isDefined(list.value.models);

      //Select the first line item from list
      list.select(0);

      assert.equal(list.selectedIndexes(), "0");
      var myOriginantor = list.$.listItem;
      var myModel = list.value.models[0];
      var myEvent = {originantor: myOriginantor, model: myModel};

      //Click the gear, Issue Stock
      setTimeout(function () {
        list.issueStock(myEvent); 
      }, 3000);
      
      setTimeout(function () {
        assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.IssueStockWorkspace");
        assert.equal(XT.app.$.postbooks.getActive().$.workspace.value.get("lineNumber"), "1");
      }, 3000);

      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      
      //Enter Qty of 3 and Save
      setTimeout(function () {
        XT.app.$.postbooks.getActive().$.workspace.$.toIssue.setValue(3);
      }, 3000);
      setTimeout(function () {
        XT.app.$.postbooks.getActive().save();
      }, 3000);
      setTimeout(function () {
        assert.equal(list.value.models[0].attributes.atShipping, 3);
      }, 3000);
      done();
    });
  });
}());
