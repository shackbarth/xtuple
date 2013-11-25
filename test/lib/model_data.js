/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true */


/*
Here's how you can use CRUD to create a model to use for your own tests:

  var crud = require("../lib/crud"),
    modelData = require("../lib/model_data"),
    assert = require("chai").assert;

  describe('Using CRUD to generate a new sales order', function () {
    var salesOrderData = modelData.salesOrderData;
    salesOrderData.skipDelete = true;
    crud.runAllCrud(modelData.salesOrderData);
    it('should have the sales order', function () {
      assert.isString(salesOrderData.model.id);
    });
  });

*/



(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
  assert = require("chai").assert;





  //
  // Data for each business object under test
  //

  exports.contact = {
    firstName: "Michael" + Math.random(),
    primaryEmail: "modonnell@xtuple.com"
  };

  exports.customer = {
    number: "ZZZCUSTOMER" + Math.random(),
    name: "TestCust",
    customerType: { code: "NORMAL" },
    salesRep: { number: "JSMITH" },
    shipCharge: { name: "ADDCHARGE" },
    terms: { code: "2-10N30" }
  };

  var quote = exports.quote = {
    calculateFreight: true,
    customer: { number: "TTOYS" },
    terms: { code: "2-10N30" }
  };

  var salesOrder = exports.salesOrder = {
    calculateFreight: true,
    customer: { number: "TTOYS" },
    terms: { code: "2-10N30" },
    wasQuote: true
  };




  //
  // More complicated business logic for quote and sales order saving
  //

  var primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.customerModel = new XM.CustomerProspectRelation();
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
      done(submodels);
    });
  };

  /**
    Useful for any model that uses XM.SalesOrderLineBase
   */
  var getBeforeSaveAction = exports.getBeforeSaveAction = function (lineRecordType) {
    return function (data, next) {
      var lineItem = new XM[lineRecordType.substring(3)](),
        itemInitialized = function (submodels) {
          var unitUpdated = function () {
            // make sure all the fields we need to save successfully have been calculated
            if (lineItem.get("price") &&
                lineItem.get("customerPrice")) {

              //lineItem.off("all", unitUpdated);
              if (!movedOn) {
                movedOn = true;
                next();
              }
            }
          };

          // changing the item site will trigger a change which will ultimately change these three
          // fields. run the callback when they all have been set
          lineItem.on("all", unitUpdated);
          data.model.get("lineItems").add(lineItem);
          // XXX This currency should be already set
          var currency = _.find(XM.currencies.models, function (curr) {
            return curr.get("isBase");
          });
          data.model.set({currency: currency});
          lineItem.set({quantity: 7});
          if (lineRecordType === "XM.InvoiceLine") {
            lineItem.set({billed: 7});
          }
          lineItem.set({item: submodels.itemModel});
          lineItem.set({site: submodels.siteModel});
        };


      var movedOn = false;
      lineItem.on("statusChange", function () {
        if (lineItem.getStatus() === XM.Model.READY_NEW) {
          primeSubmodels(itemInitialized);
        }
      });
      lineItem.initialize(null, {isNew: true});
    };
  };

  exports.salesOrderData = {
    recordType: "XM.SalesOrder",
    autoTestAttributes: true,
    createHash: salesOrder,
    /**
      An extra bit of work we have to do after the createHash fields are set:
      create a valid line item.
     */
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: getBeforeSaveAction("XM.SalesOrderLine")}],
    afterSaveActions: [{it: 'has the credit card information', action: function (data, next) {
      //assert.equal(data.model.getValue("customer.creditCards")
        //.models[0].get("number"), "************1111");
      // XXX: the commented-out code is better but relies on the encrpytion key being the demo key
      // TODO: populate our own credit card into customer and test that
      assert.equal(data.model.getValue("customer.creditCards").models[0]
        .get("number").substring(0, 12), "************");
      next();
    }}],
    updateHash: {
      wasQuote: false
    }
  };

  exports.quoteData = {
    recordType: "XM.Quote",
    autoTestAttributes: true,
    createHash: quote,
    /**
      An extra bit of work we have to do after the createHash fields are set:
      create a valid line item.
     */
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: getBeforeSaveAction("XM.QuoteLine")}],
    updateHash: {
      calculateFreight: false
    }
  };

}());
