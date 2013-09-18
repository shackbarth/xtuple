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
    this.timeout(50 * 1000);
    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    var salesOrderData = modelData.salesOrderData;
    salesOrderData.skipDelete = true;
    crud.runAllCrud(modelData.salesOrderData);

    it('User navigates to Issue to Shipping, selects the first line item, issue stock', function (done) {
      smoke.navigateToList(XT.app, "XV.ShipmentList");
      XT.app.$.postbooks.issueToShipping();
      var transactionList = XT.app.$.postbooks.getActive();
      assert.equal(transactionList.kind, "XV.IssueToShipping");
      

      //Enter the order number in the order input widget
      var orderNumber = salesOrderData.model.id;
      transactionList.$.parameterWidget.$.order.setValue(orderNumber);
      
      var list = XT.app.$.postbooks.getActive().$.list;
      assert.equal(list, "XV.IssueToShippingList");

      setTimeout(function () {
        assert.equal(transactionList.model.id, orderNumber);
        assert.isDefined(list.value.models);
        //Select the first line item from list
        list.select(0);
        assert.equal(list.selectedIndexes(), "0");
        setTimeout(function () {
          var myOriginantor = list.$.listItem;
          var myModel = list.value.models[0];
          var myEvent = {originantor: myOriginantor, model: myModel};
          //Click the gear, Issue Stock
          list.issueStock(myEvent);
          setTimeout(function () {
            var workspace = XT.app.$.postbooks.getActive().$.workspace;
            assert.equal(workspace.kind, "XV.IssueStockWorkspace");
            assert.equal(workspace.value.getStatusString(), "READY_DIRTY");
            assert.equal(workspace.value.get("lineNumber"), "1");
            //Enter Qty 2
            smoke.setWorkspaceAttributes(workspace, {toIssue: "7"}); //workspace.$.toIssue.doValueChange({value: 7})
            setTimeout(function () {
              assert.equal(workspace.value.get("toIssue"), "7");
              //Save
              smoke.saveWorkspace(workspace);

              setTimeout(function () {
                //assert.equal(workspace.value.getStatusString(), "READY_DIRTY");
                assert.equal(XT.app.$.postbooks.getActive().kind, "XV.IssueToShipping");
                  
                //Ship
                XT.app.$.postbooks.getActive().post();
                setTimeout(function () { 
                  var workspace = XT.app.$.postbooks.getActive().$.workspace;
                  assert.equal(workspace.kind, "XV.ShipShipmentWorkspace");
                  //Ship
                  workspace.save({requery: false});
                  assert.equal(XT.app.$.postbooks.getActive().kind, "XV.IssueToShipping");
                  done();
                }, 3000);
              }, 3000);
            }, 3000);
          }, 3000);
        }, 3000); 
      }, 3000);

    });
  });
}());
