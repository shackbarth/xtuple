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
    @alias SalesRep
    @property {String} id The ID attribute
    @property {String} Number
    @property {Boolean} isActive
    @property {String} Name
    @property {String} Commission
    @property {Account} Account
    */
  var spec = {
    skipAll: true, // there's some pesky nondeterminism in here somewhere
    recordType: "XM.SalesRep",
    collectionType: "XM.SalesRepCollection",
    /**
      @member -
      @memberof SalesRep.prototype
      @description The Sales Rep collection is cached.
    */
    cacheName: "XM.salesReps",
    listKind: "XV.SalesRepList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof SalesRep.prototype
      @description SalesRep is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof SalesRep.prototype
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "isActive", "name", "commission", "account"],
    requiredAttributes: ["number", "isActive"],
    /**
      @member -
      @memberof SalesRep.prototype
      @description Used in the Billing and Sales modules
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof SalesRep.prototype
      @description Users can create, update, and delete SalesReps if they have the
        'MaintainSalesReps' privilege, and they can read SalesReps if they have
        the 'ViewSalesReps' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainSalesReps",
      read: "ViewSalesReps"
    },
    createHash : {
      number: "TESTSALESREP" + Math.random(),
      name: "TestRep"
    },
    updatableField: "name",
    beforeDeleteActions: crud.accountBeforeDeleteActions,
    afterDeleteActions: crud.accountAfterDeleteActions
  };
  var additionalTests = function () {
    /**
    @member -
    @memberof SalesRep.prototype
    @description Delete option should be disabled for the Sales Reps which are assigned to
    customers
    */
    it.skip("SalesReps assigned to a customer cannot be deleted", function () {
    });
  };
  exports.spec = spec;
}());
