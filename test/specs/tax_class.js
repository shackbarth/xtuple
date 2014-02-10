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
    @alias TaxClass
    @property {String} Code
    @property {String} Description
    @property {Number} Sequence
    */
  var spec = {
    recordType: "XM.TaxClass",
    collectionType: "XM.TaxClassCollection",
    /**
      @member -
      @memberof TaxClass
      @description The Tax Class collection is cached.
    */
    cacheName: "XM.taxClasses",
    listKind: "XV.TaxClassList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TaxClass
      @description TaxClass is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxClass
      @description The ID attribute is "code", which will be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: true,
    attributes: ["id", "code", "description", "sequence"],
    requiredAttributes: ["code"],
    /**
      @member -
      @memberof TaxClass
      @description Users can create, update, and delete TaxClasses if they have the
        'MaintainTaxClasses' privilege, and they can read TaxClasses if they have
        the 'ViewTaxClasses' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxClasses",
      read: "ViewTaxClasses"
    },
    createHash: {
      code: "TC Code" + Math.random(),
      description: "Tax Class Code",
      sequence: 998
    },
    updateHash: {
      description: "updated descrip"
    },
    skipSmoke: true
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof TaxClass
    @description Delete option should be disabled for the Tax Classes which are assigned to 
    Tax Codes
    */
    it.skip("TaxClasses assigned to Tax codes cannot be deleted", function () {
    });
  };
  exports.spec = spec;
}());
