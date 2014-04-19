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
  Units of Measure represent the standard amount in which quantities of an Item
  are managed (e.g., "EACH," "POUNDS," "GALLONS," etc.).
    @class
    @alias Unit
    @property {String} Name
    @property {String} Description
    @property {Boolean} isSystem
    */
  var spec = {
    recordType: "XM.Unit",
    collectionType: "XM.UnitCollection",
    /**
      @member -
      @memberof Unit
      @description The Unit collection is cached.
    */
    cacheName: "XM.units",
    listKind: "XV.UnitList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Unit
      @description Unit is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Unit
      @description The ID attribute is "name", which will be automatically uppercased.
    */
    idAttribute: "name",
    enforceUpperKey: true,
    attributes: ["id", "name", "description", "isItemWeight"],
    requiredAttributes: ["isItemWeight", "name"],
    /**
      @member -
      @memberof Unit
      @description Units are used in Project, Purchasing and CRM modules
    */
    extensions: ["project", "crm"],
    //extensions: ["project", "purchasing", "crm"],
    /**
      @member -
      @memberof Unit
      @description Users can create, update, and delete Units if they have the
        'MaintainUOMs' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainUOMs",
      read: true
    },
    createHash : {
      name : 'IN' + Math.random(),
      description : 'Inch'
    },
    updateHash : {
      description : 'Inch Description'
    }
  };
  exports.spec = spec;
}());
