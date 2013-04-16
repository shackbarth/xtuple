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
        number: "NUMBER" + Math.random(),
        customer: { id: 95 }, // TTOYS
        terms: { id: 42 },
        salesRep: { id: 31 }
      },
      setCallback: function (next) {
        var lineItem = new XM.SalesOrderLine(),
          itemSite = new XM.ItemSite(),
          modelFetched = function () {
            if (lineItem.id && itemSite.id) {
              var unitUpdated = function () {
                lineItem.set({quantity: 5});

                data.model.get("lineItems").add(lineItem);
                console.log(JSON.stringify(lineItem.toJSON()));
                console.log(JSON.stringify(lineItem.validate(lineItem.attributes)));
                assert.equal(JSON.stringify(lineItem.validate(lineItem.attributes)), undefined);
                next();

              };

              // changing the item site will trigger a change which will ultimately change the priceUnitRatio
              lineItem.on("change:priceUnitRatio", unitUpdated);
              lineItem.set({itemSite: itemSite});
            }
          };

        itemSite.fetch({id: 303 /* BTRUCK WH1 */, success: modelFetched});
        lineItem.on("change:id", modelFetched);
        lineItem.initialize(null, {isNew: true});
      },
      updateHash: {
        code: "Dame" + Math.random()
      }
    };

  describe('Sales order', function () {
    this.timeout(10 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
/*
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
    */
  });
}());
