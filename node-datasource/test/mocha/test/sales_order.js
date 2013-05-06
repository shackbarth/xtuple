/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  /**
    Usage:
    cd node-datasource/test/mocha
    mocha -R spec ./test/sales_order.js
  */


  /**
    Useful for any model that uses XM.SalesOrderLineBase
   */
  var getSetCallback = function (lineRecordType) {
    return function (data, next) {
      var lineItem = new XM[lineRecordType.substring(3)](),
        itemSite = new XM.ItemSiteRelation(),
        modelFetched = function () {
          if (lineItem.isReady() && itemSite.isReady()) {
            var unitUpdated = function () {
              //console.log("unit updated", arguments);
              //console.log(lineItem.get("price"), lineItem.get("customerPrice"), lineItem.get("profit"), lineItem.get("tax"), lineItem.get("listPriceDiscount"));
              // make sure all the fields we need to save successfully have been calculated
              if (lineItem.get("price") &&
                  lineItem.get("customerPrice") &&
                  lineItem.get("profit") &&
                  lineItem.get("tax") &&
                  lineItem.get("listPriceDiscount")) {

                //console.log("ready to move on");
                lineItem.off("all", unitUpdated);
                next();
              }
            };

            // changing the item site will trigger a change which will ultimately change these three
            // fields. run the callback when they all have been set
            lineItem.on("all", unitUpdated); // XXX do better than this
            data.model.get("lineItems").add(lineItem);
            lineItem.set({quantity: 7});
            lineItem.set({itemSite: itemSite});
          }
        };
      itemSite.on("statusChange", modelFetched);
      itemSite.fetch({uuid: "ddbd5ae8-064e-41e1-91f6-5de054953fa3" /* BTRUCK WH1 */});
      lineItem.on("statusChange", modelFetched);
      lineItem.initialize(null, {isNew: true});
    };
  };

  var zombieAuth = require("../../vows/lib/zombie_auth"),
    crud = require("../lib/crud"),
    assert = require("chai").assert,
    salesOrderData = {
      recordType: "XM.SalesOrder",
      autoTestAttributes: true,
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
    this.timeout(10 * 1000);
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
