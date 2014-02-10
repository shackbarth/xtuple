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
  Tax Codes define the amount and type(s) of Tax to be added to an Order
    @class
    @alias TaxClass
    @property {String} Code
    @property {String} Description
    @property {TaxClass} Class
    @property {TaxAuthority} Authority
    @property {TaxCode} Basis
    */
  var spec = {
    skipSmoke: true,
    recordType: "XM.TaxCode",
    collectionType: "XM.TaxCodeCollection",
    /**
      @member -
      @memberof TaxCode
      @description The Tax Code collection is cached.
    */
    cacheName: "XM.taxCodes",
    listKind: "XV.TaxCodeList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TaxCode
      @description TaxCode is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxCode
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["id", "code", "description", "class", "authority", "basis"],
    requiredAttributes: ["code"],
    /**
      @member -
      @memberof TaxCode
      @description Tax code is used in Sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof TaxCode
      @description Users can create, update, and delete TaxCodes if they have the
        'MaintainTaxCodes' privilege, and they can read TaxCodes if they have
        the 'ViewTaxCodes' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxCodes",
      read: "ViewTaxCodes"
    },
    createHash: {
      code: "Code1"
    },
    updateHash: {
      code: "Code2"
    }
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof TaxCode
    @description Delete option should be disabled for the Tax Codes with Tax Assignments made
    */
    it.skip("TaxCodes with Tax Assignments made cannot be deleted", function () {
    });
  };
  exports.spec = spec;
}());
