/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    crud = require('../lib/crud'),
    assert = require("chai").assert;
  /**
    @class
    @alias TaxRate
    @property {TaxCode} TaxCode
    @property {Number} Percent
    @property {Number} Amount
    @property {Date} Effective
    @property {Date} Expires
    */
  var spec = {
    recordType: "XM.TaxRate",
    collectionType: "XM.TaxRateCollection",
    /**
      @member -
      @memberof TaxRate
      @description The Tax Rate collection is not cached.
    */
    cacheName: null,
    listKind: "XV.TaxRateList",
    instanceOf: "XM.Model",
    /**
      @member -
      @memberof TaxRate
      @description TaxRate is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxRate
      @description The ID attribute is "uuid", which will not be automatically uppercased.
    */
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["id", "uuid", "tax", "percent", "currency", "amount", "effectiveDate", "expirationDate"],
    requiredAttributes: ["percent", "amount", "effectiveDate", "expirationDate", "tax", "currency", "uuid"],
    /**
      @member -
      @memberof TaxRate
      @description Tax Rate is used in Sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof TaxRate
      @description Users can create, update, and delete TaxRates if they have the
        'MaintainTaxCodes' privilege, and they can read TaxRates if they have
        the 'ViewTaxCodes' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxCodes",
      read: "ViewTaxCodes"
    },
    createHash: {
      amount: 10,
      percent: 5,
      effectiveDate: new Date(),
      expirationDate: new Date(),
      tax: {code: 'VATAX-A'},
      currency: {abbreviation: 'USD'}
    },
    updateHash: {
      amount: 20
    },
    skipSmoke:true
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof TaxRate
    @description Delete option should be disabled for the Tax Rates with Tax Assignments made
    */
    it.skip("TaxRates with Tax Assignments made cannot be deleted", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
