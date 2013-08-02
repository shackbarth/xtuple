/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
module:true, require:true, exports:true, console:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore");

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
  var getSetCallback = function (lineRecordType) {
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

  var zombieAuth = require("../lib/zombie_auth"),
    crud = require("../lib/crud"),
    assert = require("chai").assert,
    salesOrderData = {
      recordType: "XM.SalesOrder",
      autoTestAttributes: true,
      createHash: {
        calculateFreight: true,
        customer: { number: "TTOYS" },
        terms: { code: "2-10N30" },
        salesRep: { number: "2000" },
        wasQuote: true
      },
      /**
        An extra bit of work we have to do after the createHash fields are set:
        create a valid line item.
       */
      beforeSaveActions: [{it: 'sets up a valid line item', action: getSetCallback("XM.SalesOrderLine")}],
      updateHash: {
        wasQuote: false
      }
    },
    quoteData = {
      recordType: "XM.Quote",
      autoTestAttributes: true,
      createHash: {
        calculateFreight: true,
        customer: { number: "TTOYS" },
        terms: { code: "2-10N30" },
        salesRep: { number: "2000" },
      },
      /**
        An extra bit of work we have to do after the createHash fields are set:
        create a valid line item.
       */
      beforeSaveActions: [{it: 'sets up a valid line item', action: getSetCallback("XM.QuoteLine")}],
      updateHash: {
        calculateFreight: false
      }
    };

  describe('Sales order', function () {
    crud.runAllCrud(salesOrderData);
  });

  describe('Sales order business logic', function () {
    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        salesOrder = new XM.SalesOrder(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
          assert.equal(salesOrder.getValue("terms.code"), "");
          salesOrder.set({customer: customer});

          // customer.terms.code gets copied to terms.code
          assert.equal(salesOrder.getValue("terms.code"), "COD");
          done();
        };

      salesOrder.on('change:number', initCallback);
      salesOrder.initialize(null, {isNew: true});
    });
  });

  describe('Quote', function () {
    crud.runAllCrud(quoteData);
  });

  describe('Quote business logic', function () {
    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        quote = new XM.Quote(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
          assert.equal(quote.getValue("terms.code"), "");
          quote.set({customer: customer});

          // customer.terms.code gets copied to terms.code
          assert.equal(quote.getValue("terms.code"), "COD");
          done();
        };

      quote.on('change:number', initCallback);
      quote.initialize(null, {isNew: true});
    });
  });
}());
