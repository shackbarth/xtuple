/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    @class
    @alias Shifts
    @property {String} number
    @property {String} name
  */
  var spec = {
    recordType: "XM.Shift",
    collectionType: "XM.ShiftCollection",
    listKind: "XV.ShiftList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Shift
      @description Shifts are lockable.
    */
    isLockable: true,
    attributes: ["id", "name", "number"],
    requiredAttributes: ["name", "number"],
    /**
    @member -
    @memberof Shift
    @description Used in the CRM and Time & Expense modules
    */
    extensions: ["crm", "time_expense"],
    /**
      @member -
      @memberof Shift
      @description Shifts can be read by all users and can be created, updated,
        or deleted by users with the "MaintainEmployees" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainShifts",
      read: true
    },
    createHash: {
      name: "First" + Math.random(),
      number: "FIRST" + Math.random()
    },
    updateHash: {
      name: "Second" + Math.random()
    }
  };

  exports.spec = spec;

}());
