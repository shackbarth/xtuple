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
    @alias ItemGroup
  */
  var spec = {
    skipSmoke: true,
    recordType: "XM.ItemGroup",
    collectionType: "XM.ItemGroupCollection",
    cacheName: null,
    listKind: "XV.ItemGroupList",
    instanceOf: "XM.Model",
    isLockable: false,
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["name", "description", "items"],
    extensions: ["crm", "sales", "project"],
    privileges: {
      createUpdate: "MaintainItemGroups",
      read: true,
      delete: "MaintainItemGroups"
    },
    createHash: {
      name: "Test item group" + Math.random(),
      description: "test item group description",
      items: { number: "YTRUCK1" }
    },
    updatableField: "name"
  };
  var additionalTests = function () {};

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

