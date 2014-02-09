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
  Tax Zones are geographic areas that have a specific tax jurisdiction and tax assignment.
  Tax Assignments are assigned on a Tax Zone and Tax Type basis to determine what 
  tax structure to apply to a given Item
    @class
    @alias TaxZone
    @property {String} Code
    @property {String} Description
  */
  var spec = {
    recordType: "XM.TaxZone",
    collectionType: "XM.TaxZoneCollection",
    /**
      @member -
      @memberof TaxZone
      @description The Tax Zone collection is cached.
    */
    cacheName: "XM.taxZones",
    listKind: "XV.TaxZoneList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TaxZone
      @description TaxZone is not lockable.
    */
    isLockable: false,
    /**
      @member -
      @memberof TaxZone
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: true,
    attributes: ["id", "code", "description"],
    requiredAttributes: ["code"],
    /**
      @member -
      @memberof TaxZone
      @description Tax Zone is used in Sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof TaxZone
      @description Users can create, update, and delete TaxZones if they have the
        'MaintainTaxZones' privilege, and they can read TaxZones if they have
        the 'ViewTaxZones' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxZones",
      read: "ViewTaxZones"
    },
    createHash: {
      code: "taxzonetest" + Math.random(),
      description: "create"
    },
    updateHash: {
      description: "update"
    },
    skipSmoke: true
  };
  exports.spec = spec;
}());
