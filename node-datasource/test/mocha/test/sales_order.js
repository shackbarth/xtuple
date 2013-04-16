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
    assert = require("chai").assert,
    data = {
      recordType: "XM.Honorific",
      autoTestAttributes: true,
      createHash: {
        code: "Herr" + Math.random()
      },
      updateHash: {
        code: "Dame" + Math.random()
      }
    };

  describe('Sales order', function (){
    this.timeout(20 * 1000);
    it('should load up the app', function (done) {
      zombieAuth.loadApp({callback: done, verbose: false});
    });

    it('should take the defaults from the customer', function () {
      var terms = new XM.Terms(),
        customer = new XM.Customer(),
        salesOrder = new XM.SalesOrder();

      terms.set({code: "COD"});
      customer.set({terms: terms});
      salesOrder.set({customer: customer});


      assert.equal(salesOrder.getValue("terms.code", "COO");

    });
  })
}());
