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
    smoke = require("../lib/smoke"),
    common = require("../lib/common"),
    crud = require('../lib/crud'),
    assert = require("chai").assert;
    /**
    Prospects are potential Customer Accounts. The system allows you to maintain information 
    on Prospectsâand then, when the time is right, it enables you to convert Prospect Accoun
    ts to Customer Accounts
    @class
    @alias Prospect
    @property {String} id The ID attribute
    @property {String} Number
    @property {String} Name
    @property {Boolean} isActive

    */
  var spec = {
    recordType: "XM.Prospect",
    collectionType: "XM.ProspectRelationCollection",
    /**
      @member -
      @memberof Prospect
      @description The Prospect collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ProspectList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Prospect
      @description Prospect is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Prospect
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "name", "notes", "contact", "salesRep", "taxZone", "site", 
    "isActive", "account", "quoteRelations"],
    requiredAttributes: ["number", "name", "isActive"],
    /**
      @member -
      @memberof Prospect
      @description Used in the Billing and Sales modules
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof Prospect
      @description Users can create, update, and delete Customers if they have the
        'MaintainProspectMasters' privilege, and they can read Prospects if they have
        the 'ViewProspectMasters' privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainProspectMasters",
      read: "ViewProspectMasters"
    },
    createHash : {
      number: "TESTPROSPECT" + Math.random(),
      name: "TestRep"
    },
    updateHash : {
      name: "Updated Test Prospect"
    },
    beforeDeleteActions: crud.accountBeforeDeleteActions,
    afterDeleteActions: crud.accountAfterDeleteActions
  };
  var additionalTests = function () {
    /**
      @member -
      @memberof Prospect
      @description Only Acitve Sales Reps should be avialable for selection in the Sales Rep picker
    */
    it.skip("Only Acitve Sales Reps should be avialable for selection in the Sales Rep picker", function () {
    });
    /**
      @member -
      @memberof Prospect
      @description Users can create and open Quotes from the Quotes panel of the Prospect screen
    */
    it.skip("Users can create and open Quotes from the Quotes panel of the Prospect screen", function () {
    });
    /**
      @member -
      @memberof Prospect
      @description Prospect record should be printable
    */
    it.skip("Prospect record should be printable", function () {
    });
    /**
    @member -
    @memberof Prospect
    @description Selecting to create a Prospect with existing customer number should display an error message
    */
    it.skip("Selecting to create a Prospect with existing customer number should display an error message", function () {
    });
    describe.skip("Prospects List", function () {
      /**
      @member -
      @memberof Prospect
      @description Prospects can be converted to Customer by select 'Convert' in the Actions menu
      */
      it.skip("Prospects can be converted to Customer by select 'Convert' in the Actions menu", function () {
      });
    });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
