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
    @class
    @alias Item
  */
  var spec = {
    recordType: "XM.ItemSite",
    skipCrud: true, // TODO: we have to make a new item to attach, because all pre-existing items already
    // have a WH1 itemsite
    skipSmoke: true,
    collectionType: "XM.ItemSiteListItemCollection",
    cacheName: null,
    listKind: "XV.ItemSiteList",
    instanceOf: "XM.Model",
    isLockable: true,
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["uuid"],
    extensions: ["sales"],
    privileges: {
      createUpdate: "MaintainItemSites",
      read: "ViewItemSites",
      delete: "DeleteItemSites"
    },
    createHash: {
      uuid: "NEWTEST" + Math.random(),
      item: {number: "CBODY1"},
      site: {code: "WH1"},
      isActive: true,
      plannerCode: {code: "MRP"},
      costCategory: {code: "MATERIALS"},
      notes: ""
    },
    updatableField: "notes"
  };
  var additionalTests = function () {
    describe.skip("Item site relation widget", function () {
      it("Selecting to enter the item alias manually in the Item relation widget" +
          "should display the related item for selection", function () {
      });
      it("Aliases option should be available on the Item widget which displays " +
          "Active Alias Items on selection", function () {
      });
      it("Selecting the Alias in the Item relation widget should populate the Item" +
          "Number in the item Number field and Alias Name in the" +
          "Customer P/N field", function () {
      });
      it("Should be able to search the Item through Bar Code", function () {
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());


