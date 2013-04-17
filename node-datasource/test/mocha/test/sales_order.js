/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  /**
    Usage:
    cd node-datasource/test/mocha
    mocha -R spec
  */

  var zombieAuth = require("../../vows/lib/zombie_auth"),
    crud = require("../lib/crud"),
    assert = require("chai").assert,
    data = {
      recordType: "XM.SalesOrder",
      autoTestAttributes: true,
      createHash: {
        calculateFreight: true,
        customer: { id: 95 }, // TTOYS
        terms: { id: 42 },
        salesRep: { id: 32 },
        wasQuote: true
      },
      /**
        An extra bit of work we have to do after the createHash fields are set:
        create a valid line item.
       */
      setCallback: function (next) {
        var lineItem = new XM.SalesOrderLine(),
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
        itemSite.fetch({id: 303 /* BTRUCK WH1 */, success: modelFetched});
        lineItem.on("change:id", modelFetched);
        lineItem.initialize(null, {isNew: true});
      },
      updateHash: {
        wasQuote: false
      }
    };

  describe('Sales order', function () {
    this.timeout(10 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
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

      salesOrder.on('change:id', initCallback);
      salesOrder.initialize(null, {isNew: true});
    });
  });
}());
