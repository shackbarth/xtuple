/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth"),
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

  describe('Issue to Shipping Transaction', function () {
    this.timeout(20 * 1000);

    before(function (done) {
      zombieAuth.loadApp(function () {
        primeSubmodels(function (err, submods) {
          submodels = submods;
          done();
        });
      });
    });

    describe('describe User navigates to Issue to Shipping', function () {
      it('User navigates to Issue to Shipping', function (done) {
        this.timeout(30 * 1000);
        var navigator = XT.app.$.postbooks.$.navigator;
        navigator.setModule(2);
        XT.app.$.postbooks.issueToShipping();
        setTimeout(function () {
          assert.equal(XT.app.$.postbooks.getActive().kind, "XV.IssueToShipping");
          done();
        }, 5000);
      });

      it('User selects New from Order widget to create a new Sales Order', function (done) {
        //order = transactionList.$.parameterWidget.$.order
        //order.setValue("40000")
        var transactionList = XT.app.$.postbooks.getActive();
        var myOriginator = transactionList.$.parameterWidget.$.order.$.input.$.newItem;
        var myEvent = {originator: myOriginator};
        transactionList.$.parameterWidget.$.order.$.input.itemSelected(null, myEvent);
        setTimeout(function () {
          assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.SalesOrderWorkspace");
          done();
        }, 5000);
        //now in new Sales Order Workspace
        var salesOrder = XT.app.$.postbooks.getActive().$.workspace;
        salesOrder.$.customerWidget.doValueChange({value: "TTOYS"});
        salesOrder.$.sitePicker.doValueChange({value: "WH1"});
        
        salesOrder.$.salesOrderLineItemGridBox.newItem();
        
        var gridRow = salesOrder.$.salesOrderLineItemGridBox.$.editableGridRow;

        gridRow.$.itemSiteWidget.doValueChange({value: {item: "YTRUCK1", site: "WH1"}});
        setTimeout(function () {
          gridRow.$.quantityWidget.doValueChange({value: 3});
          done();
        }, 5000);
        setTimeout(function () {
          XT.app.$.postbooks.getActive().$.workspace.save(); 
          done();
        }, 5000);
        setTimeout(function () {
          XT.app.$.postbooks.previous(); 
          done();
        }, 5000);
      });

      it('User selects the first line item and Issues Stock', function (done) {
        //Select a line item and click the line item action gear to issueStock
        var list = XT.app.$.postbooks.getActive();
        list.$.list.select(0);
        /*
        var myOriginantor = list.$.list.$.listItem;
        var myModel = list.$.list.value.models[0];
        var myEvent = {originantor: myOriginantor, model: myModel};
        
        list.$.list.issueStock(myEvent);
        var issueStock = XT.app.$.postbooks.getActive().$.workspace;
        issueStock.$.toIssue.setValue(3);
        issueStock.save();
        //I have to get to the model that issueAll() is on and put a listener on it to check getStatusString === 'READY CLEAN' 
        setTimeout(function () {
          assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.IssueStockWorkspace");
          done();
        }, 5000); */
      }); 
    });
  });
}());
