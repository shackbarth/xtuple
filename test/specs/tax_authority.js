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
    @alias TaxAuthority
    @property {String} Code
    @property {String} Name
    @property {String} ExternalReference
    @property {Currency} Currency
    @property {String} County
    @property {Address} Address
    @property {Account} Account
    */
  var spec = {
    recordType: "XM.TaxAuthority",
    collectionType: "XM.TaxAuthorityCollection",
    /**
      @member -
      @memberof TaxAuthority
      @description The Tax Authority collection is cached.
    */
    cacheName: "XM.taxAuthorities",
    listKind: "XV.TaxAuthorityList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TaxAuthority
      @description TaxAuthority is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxAuthority
      @description The ID attribute is "code", which will be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: true,
    attributes: ["id", "code", "name", "externalReference", "currency", "county", "address", "account"],
    requiredAttributes: ["code", "name"],
    /**
      @member -
      @memberof TaxAuthority
      @description Users can create, update, and delete TaxAuthorities if they have the
        'MaintainTaxAuthorities' privilege, and they can read TaxAuthorities if they have
        the 'ViewTaxAuthorities' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxAuthorities",
      read: "ViewTaxAuthorities"
    },
    createHash : {
      code: "TAXAUTH3" + Math.random(),
      name: "TAXAUTH NAME"
    },
    updatableField: "name",
    skipSmoke: true,
    beforeDeleteActions: crud.accountBeforeDeleteActions,
    afterDeleteActions: crud.accountAfterDeleteActions
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof TaxAuthority
    @description Delete option should be disabled for the Tax Authorities which are assigned to 
    Tax Codes
    */
    it.skip("TaxAuthorities assigned to Tax codes cannot be deleted", function () {
    });
  };
  exports.spec = spec;
}());
