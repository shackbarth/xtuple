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
    assert = require("chai").assert,
    spec = {
      recordType: "XM.PostProduction",
      skipAll: true
    };

  var additionalTests = function () {
    describe.skip("Post Production", function () {
      it("Work Orders in Imploded and closed state should not be available" +
                    "for selection", function () {
      });
      it("When a Work Order is selected- Item Number, UOM, Item Description, Site," +
                    "Work Order status, Method, Qty. Order, Qty. Received and Balance Due" +
                    "should be displayed", function () {
      });
      it("Production Notes Text area, Backflush Materials, Close Work Order after Posting," +
                    "Scrap on Post checkboxes should be available in the workspace", function () {
      });
      it("All users should be available for selection in the Setup By and" +
                    "Run By widgets", function () {
      });
      it("Backflush Materials should be checked by default for Work orders not in" +
                    "Exploded/Release state", function () {
      });
      describe("When the materials are not already issued and Backflush Materials " +
                                        "option is checked", function () {
        it("Selecting to Post the production should decrease the QOH of the work order " +
                        "materials by the posted quantity", function () {
        });
        it("If one of the Work order materials is a MLC/SERIAL/LOT type item, selecting to" +
                        "post the production should display a Detail panel to distribute the quantity", function () {
        });
      });
      it("If all the work order materials are already issued, 'Backflush Materials' option should" +
                    "be inactive", function () {
      });
      it("If one of the work order operations is already posted, 'Backflush Materials' option " +
                    "should be checked and inactive", function () {
      });
      it("Selecting to Post the Production should increase the Work Order Item QOH by the" +
                    "Posted quantity", function () {
      });
      it("If the Work order Item is a SERIAL/LOT controlled item, selecting to post the " +
                    "production should display a Create Lot/Serial# screen", function () {
      });
      it("If 'Close Work order after Posting' option is checked, a Close work order screen " +
                    "should be displayed after posting the production", function () {
      });
      it("When Qty. to Post value is 0 or left blank, selecting 'Post' should display a '" +
                    "Enter Quantity to Post' dialog", function () {
      });
      it("Work Order #, Qty. to Post and Production Notes fields should be cleared " +
                    "after the Post Production and Post button should be inactive", function () {
      });
    });
  };
  //Disabling the test as it requires the manufacturing extension to be installed and enabled
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
