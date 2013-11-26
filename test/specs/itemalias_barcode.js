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
    assert = require("chai").assert;
  var additionalTests = function () {
    describe.skip("Item screen", function () {
      it("Bar Code field should present in the Item screen and should be editable", function () {
      });
      it("List of Aliases should exist in the Item screen", function () {
      });
      it("Aliases can be created, updated and deleted", function () {
      });
      describe("Item Alias Screen", function () {
        it("Item Alias should contain the following fields - Item Number,Alias Number," +
            "Associated CRMAccount, 'Use Description' checkbox, Description, " +
            "Comments", function () {
        });
        it("Item Number field should be read only", function () {
        });
        it("Use an Alias option should be unchecked and Description field " +
            "should be inactive by default", function () {
        });
        it("Description field should be enabled when 'Use Description' " +
            "option is selected", function () {
        });
      });
    });
    describe.skip("Item relation widget", function () {
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
  //exports.additionalTests = additionalTests;
}());