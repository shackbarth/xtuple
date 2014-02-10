/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    @class
    @alias States
    @property {String} Name
    @property {String} Abbreviation
    @property {String} Country
  */
  var spec = {
    recordType: "XM.State",
    collectionType: "XM.StateCollection",
    cacheName: "XM.states",
    listKind: "XV.StateList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof State
      @description States are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof State
      @description The ID attribute is "name", which will not be automatically uppercased.
    */
    idAttribute: "abbreviation",
    enforceUpperKey: false,
    attributes: ["id", "name", "abbreviation", "country"],
    requiredAttributes: ["name", "abbreviation", "country"],
    /**
    @member -
    @memberof Customer
    @description Used in the Billing and Sales modules
    */
    extensions: ["project", "crm"],
    /**
      @member -
      @memberof State
      @description States can be read by all users and can be created, updated,
        or deleted by users with the "MaintainStates" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainStates",
      read: true
    },
    createHash: {
      name: "Milky Way" + Math.random(),
      abbreviation: "MW" + Math.random(),
      country: {abbreviation: "AO" }
    },
    updateHash: {
      abbreviation: "XY" + Math.random()
    }
  };

  exports.spec = spec;

}());

