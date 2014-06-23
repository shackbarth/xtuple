/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var crud = require("../lib/crud"),
    assert = require("chai").assert;
   /**
  @class
  @alias CreditCard
  @property {String} id
  @property {String} sequence
  @property {Customer} Customer
  @property {Boolean} isActive
  @property {Name} Name
  @property {String} Address1
  @property {String} Address2
  @property {String} City
  @property {String} State
  @property {String} Zip
  @property {Country} Country
  @property {Number} Number
  @property {Date} monthExpired
  @property {Date} yearExpired
  @property {Boolean} isDebit
  @property {String} CreditCardType
  **/
  var spec = {
    recordType: "XM.CreditCard",
    enforceUpperKey: false,
    collectionType: "XM.CreditCardCollection",
    listKind: "XV.CreditCardList",
    instanceOf: "XM.Model",
    attributes: ["id", "uuid", "sequence", "customer", "isActive", "name", "address1", "address2",
    "city", "state", "zip", "country", "number", "monthExpired", "yearExpired", "isDebit",
    "creditCardType"],
    idAttribute: "uuid",
    /**
      @member -
      @memberof CreditCard
      @description Used in the Sales and billing modules
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof CreditCard
      @description CreditCards are not lockable.
    */
    isLockable: false,
    /**
    @member -
    @memberof CreditCard
    @description The Credit Card collection is cached.
    */
    cacheName: null,
    /**
      @member -
      @memberof CreditCard
      @description CreditCards can be created and updated by users with the "ProcessCreditCards"
      privilege but cannot be deleted
    */
    privileges: {
      createUpdate: "ProcessCreditCards",
      read: "ProcessCreditCards"
    },
    createHash : {
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
    /**
      @member -
      @memberof CreditCard
      @description First 12 digits of the credit card number should be masked
    */
    afterSaveActions: [{
      it: "should mask the first 12 digits of the credit card number",
      action: function (data, next) {
        assert.equal(data.model.get("sequence"), 500);
        assert.equal(data.model.get("name"), "John Smith");
        assert.equal(data.model.get("number"), "************1111");
        next();
      }
    }],
    /**
      @member -
      @memberof CreditCard
      @description User should not be allowed to update the number/type of the Credit Card
    */
    beforeDeleteActions: [{
      it: "should not allow an update to the number or type",
      action: function (data, next) {
        assert.equal(data.model.get("sequence"), 550);
        assert.equal(data.model.get("creditCardType"), "V");
        assert.equal(data.model.get("number"), "************1111");
        next();
      }
    }],
    skipSmoke: true, // credit card is not a first-class business model
    skipDelete: true
  };
  exports.spec = spec;
}());
