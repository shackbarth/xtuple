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
    number: "CUSTOMER" + Math.random(),
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

  exports.quoteData = {
    recordType: "XM.Quote",
    autoTestAttributes: true,
    createHash: quote,
    /**
      An extra bit of work we have to do after the createHash fields are set:
      create a valid line item.
     */
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: require("../specs/sales_order").getBeforeSaveAction("XM.QuoteLine")}],
    updateHash: {
      calculateFreight: false
    }
  };

}());
