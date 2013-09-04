/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require("../lib/crud"),
    assert = require("chai").assert;

  var data = exports.data = {
    recordType: "XM.CreditCard",
    autoTestAttributes: false,
    createHash: {
      customer: 95, // TTOYS
      creditCardType: "V",
      name: "John Smith",
      address1: "123 Main Street",
      city: "Norfolk",
      state: "VA",
      zip: "23510",
      country: "USA",
      monthExpired: "05",
      yearExpired: "2010",
      number: "4111111111111111",
      sequence: 500
    },
    updateHash: {
      creditCardType: "M",
      number: "1234123412341234",
      sequence: 550
    },
    afterSaveActions: [{
      it: "should mask the first 12 digits of the credit card number",
      action: function (data, next) {
        assert.equal(data.model.get("sequence"), 500);
        assert.equal(data.model.get("name"), "John Smith");
        assert.equal(data.model.get("number"), "************1111");
        next();
      }
    }],
    beforeDeleteActions: [{
      it: "should not allow an update to the number or type",
      action: function (data, next) {
        assert.equal(data.model.get("sequence"), 550);
        assert.equal(data.model.get("creditCardType"), "V");
        assert.equal(data.model.get("number"), "************1111");
        next();
      }
    }],
    skipDelete: true
  };

  describe('Credit card crud test', function () {
    crud.runAllCrud(data);
  });
}());
