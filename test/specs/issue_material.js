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
  var spec = {
    skipAll: true,
    recordType: "XM.IssueMaterial",
    collectionType: "XM.IssueMaterialCollection",
    cacheName: null,
    listKind: "XV.IssueMaterialList",
    instanceOf: "XM.Model",
    isLockable: false,
    idAttribute: "uuid",
    attributes: ["uuid", "order", "itemSite", "item", "site", "status",
    "method", "unit", "qtyPer", "qtyFixed", "scrap", "qtyRequired",
    "qtyIssued", "qtyWipScrapped", "balance", "toIssue", "qohBefore"],
    extensions: ["manufacturing"],
    privileges: {
      createDelete: false,
      updateRead: ["IssueWoMaterials", "ReturnWoMaterials"]
    },
    skipSmoke: true,
    skipCrud: true
  };
  var additionalTests = function () {
    describe.skip("Work Order widget should be created", function () {
      it("Should enable user to enter Work order manually", function () {
      });
      it("Should have a Search option which displays the available list of work" +
                    "orders", function () {
      });
    });
    describe.skip("Issue Material", function () {
      it("Work Orders in Imploded and closed state should not be available for " +
                    "selection", function () {
      });
      it("Selecting a Work order # should populate the Component Item Number picker with" +
         "the corresponding Work Order requirement items", function () {
      });
      it("A selected component item should have 'Issue Line', 'Issue Item' and " +
                    "'Return Line' actions", function () {
      });
      it("Selecting 'Issue Item' should open a Issue Materials screen", function () {
      });
      describe("Issue Material screen", function () {
        it("Should contain the following fields" +
            "Order, Item, Material Unit, Qty Required, Qty Issued, To Issue", function () {
        });
        it("Order, Item, Material Unit, Qty Required, Qty Issued fields should be uneditable and" +
                        " To Issue field should be editable", function () {
        });
        it("Selecting Issue with blank value in 'To Issue' field displays a '" +
                        "'To Issue' must be positive' dialog", function () {
        });
      });
      it("When the selected Work order material is a MLC/Lot/Serial item, a Detail tab should" +
                    "be displayed on selecting 'Post' button", function () {
      });
      it("QOH of the selected item should be decreased by Issued " +
                    "quantity on Issuing", function () {
      });
      it("QOH of the selected item should be returned back to the same amount " +
                    "on selecting Return Line", function () {
      });
    });
    it("Selecting 'Return Material' should display two options" +
                "- 'By Item' and 'By Batch'", function () {
    });
  };
  //Disabling the test as it requires the manufacturing extension to be installed and enabled
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
