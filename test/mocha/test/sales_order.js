/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  /**
    Useful for any model that uses XM.SalesOrderLineBase
   */
  var getSetCallback = function (lineRecordType) {
    return function (data, next) {

      var movedOn = false,
        lineItem = new XM[lineRecordType.substring(3)](),
        itemSite = new XM.ItemSiteRelation(),
        modelFetched = function () {
          if (lineItem.isReady() && itemSite.isReady()) {
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
            lineItem.on("all", unitUpdated); // XXX do better than this
            data.model.get("lineItems").add(lineItem);
            data.model.set({currency: XM.currencies.models[0]}); // XXX shouldn't be necessary
            lineItem.set({quantity: 7});
            lineItem.set({itemSite: itemSite});
          }
        };
      itemSite.on("statusChange", modelFetched);
      itemSite.fetch({uuid: "d4b9a61f-f53c-4679-f9c4-bc9057823964" /* BTRUCK1 WH1 */}); // XXX this is fragile
      lineItem.on("statusChange", modelFetched);
      lineItem.initialize(null, {isNew: true});
    };
  };

  var zombieAuth = require("../lib/zombie_auth"),
    crud = require("../lib/crud"),
    assert = require("chai").assert,
    salesOrderData = {
      recordType: "XM.SalesOrder",
      autoTestAttributes: true,
      verbose: true,
      createHash: {
        calculateFreight: true,
        customer: { number: "TTOYS" },
        terms: { code: "COD" },
        salesRep: { number: "2000" },
        wasQuote: true
      },
      /**
        An extra bit of work we have to do after the createHash fields are set:
        create a valid line item.
       */
      setCallback: getSetCallback("XM.SalesOrderLine"),
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
        terms: { code: "COD" },
        salesRep: { number: "2000" },
      },
      /**
        An extra bit of work we have to do after the createHash fields are set:
        create a valid line item.
       */
      setCallback: getSetCallback("XM.QuoteLine"),
      updateHash: {
        calculateFreight: false
      }
    };

  describe('Sales order', function () {
    this.timeout(15 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(salesOrderData, done);
    });

    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        salesOrder = new XM.SalesOrder(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
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
    this.timeout(10 * 1000);
    it('should perform all the crud operations on quote', function (done) {
      crud.runAllCrud(quoteData, done);
    });

    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        quote = new XM.Quote(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
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
