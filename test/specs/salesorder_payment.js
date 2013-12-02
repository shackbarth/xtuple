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
    describe.skip("Sales Order Payment", function () {
      it("A Payment panel should be added to the sales order screen", function () {
      });
      it("Order Total, Balance fields should be read only and Amount Received field should" +
          "be editable", function () {
      });
      it("Funds Type picker menu should contain the following options: Cash, Check, " +
          "Certified Check, Wired Transfer, Other", function () {
      });
      it("Post to picker menu should display the available Bank accounts", function () {
      });
      it("User Alternate A/R Account checkbox should be inactive by default", function () {
      });
      it("Selecting 'Post Payment button' should should 'save' the Sales Order and post the" +
          "payment to the Sales Order", function () {
      });
      it("Sales Category Picker menu should be enabled on checking " +
          "'Use Alternate A/R Account' option and list available Sales Categories ", function () {
      });
      it("Selecting to Post Cash Payment with Application Date " +
          "earlier than Distribution Date should display an error dialog", function () {
      });
      it("If currency on salesOrder does not match 'PostTo' bank account" +
        "(ex. USD on SO, EUR on account), return prompt to ask user if they'd like to convert" +
        "to bankAccount currency", function () {
      });
      it("Balance amount should be recalculated on selecting to" +
          "Post Cash Payment", function () {
      });
      it("Selecting to post cash payment with 'Amount Received' is greater than" +
        "balance return error", function () {
      });
      it("Selecting to post cash payment with blank or zero in 'Amount Received'  " +
          "field should display an error message", function () {
      });
      it("Allocated Credit field in the Line Items panel should display the " +
          "amount posted", function () {
      });
      it("Selecting to Save the sales order without posting the cash payment" +
          "should display an error dialog", function () {
      });
    });
  };
  //exports.additionalTests = additionalTests;
}());
