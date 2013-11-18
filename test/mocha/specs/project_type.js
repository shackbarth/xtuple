/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;

  var spec = {
    recordType: "XM.ProjectType",
    collectionType: "XM.ProjectType",
    cacheName: XM.projectTypes,
    listKind: "XV.ProjectTypeList",
    instanceOf: "XM.Document",
    isLockable: false,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description"],
    extensions: ["project"],
    privileges: {
      createUpdate: "MaintainProjectTypes",
      read: "MaintainProjectTypes"
    },
    createHash: {
      name: "TestProjectType" + Math.random(),
      description: "Test project type",
      bankName: "TestBankName",
      accountNumber: Math.random(),
      notes: "Test project type notes"
    },
    defaults: {
      isActive: true
    },
    updatableField: "description"
  };

  var additionalTests = function () {};

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
