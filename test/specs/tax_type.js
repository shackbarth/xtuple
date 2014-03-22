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
  Tax Types provide a system for classifying goods and services into taxable categories.
  For example, using the Item master you can associate an Item with a particular Tax Type
    @class
    @alias TaxType
    @property {String} Name
    @property {String} Description
    @property {Boolean} isSystem
    */
  var spec = {
    recordType: "XM.TaxType",
    collectionType: "XM.TaxTypeCollection",
    /**
      @member -
      @memberof TaxType
      @description The Tax Type collection is cached.
    */
    cacheName: "XM.taxTypes",
    listKind: "XV.TaxTypeList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TaxType
      @description TaxType is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxType
      @description The ID attribute is "name", which will be automatically uppercased.
    */
    idAttribute: "name",
    enforceUpperKey: true,
    attributes: ["id", "name", "description", "isSystem"],
    requiredAttributes: ["name"],
    /**
      @member -
      @memberof TaxType
      @description Tax Type is used in Sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof TaxType
      @description Users can create, update, and delete TaxTypes if they have the
        'MaintainTaxTypes' privilege, and they can read TaxTypes if they have
        the 'ViewTaxTypes' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxTypes",
      read: "ViewTaxTypes"
    },
    createHash: {
      name: "taxType" + Math.random()
    },
    updateHash: {
      name: "updatedType" + Math.random()
    },
    skipSmoke: true
  };
  exports.spec = spec;
}());
