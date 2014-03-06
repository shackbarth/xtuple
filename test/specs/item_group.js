/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    common = require("../lib/common");

  /**
  Item Groups provide an alternate means for sorting Items into categories.
  The advantage to Item Groups is that a single Item may belong to multiple Item Groups.
  This is in contrast to Class Codes and Product Categories, in that single Items may
  belong to only one of each of these categories
    @class
    @alias ItemGroup
    @property {String} Name
    @property {String} Description
    @property {Item} Items
  */
  var spec = {
    skipSmoke: true,
    recordType: "XM.ItemGroup",
    collectionType: "XM.ItemGroupRelationCollection",
    /**
    @member -
    @memberof ItemGroup.prototype
    @description The Item Group collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ItemGroupList",
    instanceOf: "XM.Model",
    /**
      @member -
      @memberof ItemGroup.prototype
      @description Item Groups are lockable.
    */
    isLockable: false,
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["name", "description", "items"],
    /**
      @member -
      @memberof ItemGroup.prototype
      @description Used in the crm,sales and project module
    */
    extensions: ["crm", "sales", "project"],
    /**
      @member -
      @memberof ItemGroup.prototype
      @description ItemGroups can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainItemGroups" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainItemGroups",
      read: true
    },
    createHash: {
      name: "Test item group" + Math.random(),
      description: "test item group description"
      //items: { number: "YTRUCK1" }
    },
    updatableField: "name"
  };
  var additionalTests = function () {
    /**
      @member -
      @memberof ItemGroup.prototype
      @description Items can be attached/detached to a new item group while creation
    */
    it.skip("Items can be attached/detached to a new Item group while creation", function () {
    });
    /**
      @member -
      @memberof ItemGroup.prototype
      @description Items can be attached/detached to an existing Item group opened in edit mode
    */
    it.skip("Items can be attached/detached to an existing Item Group opened in edit mode",
    function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

