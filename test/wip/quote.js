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
  var getSetCallback = function (lineRecordType) {
    return function (data, next) {
      var lineItem = new XM[lineRecordType.substring(3)](),
        itemSite = new XM.ItemSiteRelation(),
        modelFetched = function () {
          if (lineItem.id && itemSite.id) {
            var unitUpdated = function () {
              // make sure all the fields we need to save successfully have been calculated
              if (lineItem.get("price") &&
                  lineItem.get("customerPrice") &&
                  lineItem.get("profit") &&
                  lineItem.get("tax") &&
                  lineItem.get("listPriceDiscount")) {

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
      itemSite.fetch({id: 303, success: modelFetched});
      lineItem.on("change:id", modelFetched);
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
        customer: { id: 95 }, // TTOYS
        terms: { id: 42 },
        salesRep: { id: 32 },
        wasQuote: true
      },
      // An extra bit of work we have to do after the createHash fields are set:
      //  create a valid line item.
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
        customer: { id: 95 }, // TTOYS
        terms: { id: 42 },
        salesRep: { id: 32 },
      },
      // An extra bit of work we have to do after the createHash fields are set:
      // create a valid line item.
      setCallback: getSetCallback("XM.QuoteLine"),
      updateHash: {
        calculateFreight: false
      }
    };

  describe('Quote', function () {
    this.timeout(20 * 1000);
    var quote;

    describe('Creating a New Quote', function () {
      before(function (done) {
        var takeTheDefaults = function () {
          var initCallback = function () {
            done();
          };
          //Create a new Quote; Verify the defaults.
          quote = new XM.Quote(),
          quote.on('change:id', initCallback);
          quote.initialize(null, {isNew: true});
        };
        zombieAuth.loadApp(takeTheDefaults);
      });

      describe('Verify New Quote', function () {
        it.skip('Order Number will default with the next available number', function (){
          console.log(XT.dataSource.dispatch("XM.Sales", 'settings', "XM.Sales", {
            success:
              function (result){result.NextQuoteNumber;
              //console.log("RESULTS: " + result.NextQuoteNumber);
            }})
          );
          //console.log("NUMBER: " + quote.getValue("number"));
        });

        it('Order Date will default to the current date',function (){
          var date = new Date();
          assert.equal(quote.getValue("quoteDate").toString('dddd, MMMM ,yyyy')
            , date.toString('dddd, MMMM ,yyyy'));
        });

        it('Site will default to the Site Master', function (){
          //console.log("CODE: " + quote.get("site").attributes.get("code"));
          var defaultSite = XT.defaultSite();
          //console.log("CODE: " + defaultSite.attributes.code);
          assert.equal(quote.get("site").attributes.get("code"), defaultSite.attributes.code);
        });

        it('Sale Type will default to the Sales Order Setup', function (){
          var salesType = XM.saleTypes.at(0);
          //console.log("salesType: " + salesType.attributes.code);
          //console.log("CODE: " + quote.get("saleType").attributes.code);
          assert.equal(quote.get("saleType").attributes.code, salesType.attributes.code);

        });

        it('Quote Status will default to Open', function (){
          assert.equal(quote.getValue("status"), 'O');
        });

        it.skip('Currency will default to Base Currency', function (){
          console.log("CURRENCY: " + quote.get("currency"));
        });

        it('New Line Item will be set to Inactive');
        it('Attempting to Save will give an error – You must select a Customer for this order before you may save it');
      });
    });


    //Create a new quote and add a customer; verify the defaults.
    describe('Enter a Customer', function () {
      before(function (done) {
        var takeTheDefaults = function () {
          var terms = new XM.Terms(),
            taxZone = new XM.TaxZone(),
            shipVia = new XM.ShipVia(),
            shipZone = new XM.ShipZone(),
            customer = new XM.CustomerProspectRelation(),
            initCallback = function () {
              terms.set({code: "COD"});
              taxZone.set({code: "AlphaZone"});
              shipVia.set({code: "UPSVia"});
              shipZone.set({code: "MidWest"});
              customer.set({terms: terms,
                            taxZone: taxZone,
                            shipVia: shipVia,
                            defaultShipto.shipZone: shipZone,
                            billtoContact: "Bob"});
              quote.set({customer: customer});

              // customer.terms.code gets copied to terms.code
              done();
            };

          quote = new XM.Quote(),
          quote.on('change:id', initCallback);
          quote.initialize(null, {isNew: true});
        };
        zombieAuth.loadApp(takeTheDefaults);
      });
      describe('Validate Defaults', function () {
        it('Terms will populate with the Customers Terms', function (){
          assert.equal(quote.getValue("terms.code"), "COD");
        });

        it('Tax Zone will populate with the Customers Tax Zone', function (){
          assert.equal(quote.getValue("taxZone.code"), "AlphaZone");
        });
        it('Bill-To will populate with the Customers');
        it('Ship-To will populate with the Customers');
        it('Bill-To Contact will populate with the Customers');
        it('Ship-To Contact will populate with the Customers');
        it('Ship Via will populate with the Customers preferred Ship Via', function (){
          assert.equal(quote.getValue("shipVia.code"), "UPSVia");
        });
        it.('Shipping Zone will populate with the Customers preferred Shipping Zone', function (){
          assert.equal(quote.getValue("defaultShipto.shipZone.code"), "MidWest");
        });
        it('Shipping Notes will populate with Customers Shipping Notes');
        it('New Line Item will be Active');
      });
    });

  });

   */
}());
