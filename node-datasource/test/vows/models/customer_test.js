/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var createHash = {
    name: "TESTCUSTOMER",
    number: "HELLO" + Math.random(),
    customerType: 19,
    terms: 42,
    salesRep: 29,
    backorder: true,
    partialShip: true,
    discount: 0,
    balanceMethod: "B",
    isFreeFormShipto: true,
    blanketPurchaseOrders: false,
    shipCharge: 4,
    creditStatus: "G",
    isFreeFormBillto: false,
    usesPurchaseOrders: false,
    autoUpdateStatus: false,
    autoHoldOrders: false
  };

  var updateHash = {
    name: "UPDATETESTCUSTOMER"
  };

  /**
    Test the Customer model
   */
  vows.describe('Customer testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'We can run the CRUD tests for Customer': crud.testCrudOperations("Customer", createHash, updateHash)

      // XXX look at honorific test to see how business logic can also be tested alongside CRUD operations
    }
  }).export(module);
}());
