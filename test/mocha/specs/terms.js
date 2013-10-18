/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    assert = require("chai").assert,
    model;

  var additionalTests = function () {
    it("has the terms type constant DAYS", function () {
      assert.equal(XM.Terms.DAYS, "D");
    });
    it("has the terms type constant PROXIMO", function () {
      assert.equal(XM.Terms.PROXIMO, "P");
    });
    it("when the terms type is set to DAYS", function (done) {
      var initComplete = function () {
        model.set(require("../lib/specs").terms.createHash);
        model.set("termsType", XM.Terms.DAYS);
        done();
      };

      model = new XM.Terms();
      model.on("statusChange", initComplete);
      model.initialize(null, {isNew: true});
    });
    // TODO: these days tests should be nested inside
    it("Validation should check that the dueDays attribute is any positive integer", function () {
      model.set({dueDays: "Not a number"});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 10.5});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: -1});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 0});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
      model.set({dueDays: 31});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
      model.set({dueDays: 132});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
    });
    it("the cutOffDate day should be set to read only = true", function () {
      assert.equal(model.isReadOnly("cutOffDay"), true);
    });
    it("when the terms type is set to PROXIMO", function () {
      model.set("termsType", XM.Terms.PROXIMO);
    });
    // TODO: these proximo tests should be nested inside
    it("the dueDay attribute should change to 1", function () {
      assert.equal(model.get("dueDays"), 1);
    });
    it("the discountDay attribute should change to 1", function () {
      assert.equal(model.get("discountDays"), 1);
    });
    it("cutOffDay should be set to read only = false", function () {
      assert.equal(model.isReadOnly("cutOffDay"), false);
    });
    it("The cutoffDay attribute should validate only integers between 0 and 31", function () {
      model.set({cutOffDay: "Not a number"});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 10.5});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: -1});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 0});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
      model.set({cutOffDay: 32});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 31});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
    });
    it("Validation should check that the dueDays attribute is only integers between 0 and 31", function () {
      model.set({dueDays: "Not a number"});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 10.5});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: -1});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 0});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
      model.set({dueDays: 32});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 31});
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
    });

    it("There should be a collection of static XM.termsTypes using the above 2 constants", function () {
      assert.isDefined(XM.termsTypes);
      assert.equal(XM.termsTypes.length, 2);
    });


    // TODO: nest in require
    it("XM.Terms should include a prototype function calculateDueDate() that accepts a start date " +
        "and returns a date by doing the following:", function () {
      assert.isDefined(model.calculateDueDate);
    });
    it("If the termsType is XM.Terms.DAYS then the due date is the start date + the terms dueDays", function () {
      var startDate = new Date("5/12/13"),
        nextWeek = new Date("5/19/13");

      model.set("termsType", XM.Terms.DAYS);
      model.set({dueDays: 7});
      assert.equal(model.calculateDueDate(startDate).getTime(), nextWeek.getTime());

    });
    it("If the termsType is XM.Terms.PROXIMO then " +
        "If the start date day <= the terms cutoff day the due date is the dueDays day of the current month " +
        "Otherwise the due date is the dueDays day of the next month", function () {
      var startDateEarly = new Date("5/12/13"),
        startDateMiddle = new Date("5/20/13"),
        startDateLate = new Date("5/22/13"),
        thisDueDate = new Date("5/20/13"),
        nextDueDate = new Date("6/20/13");

      model.set("termsType", XM.Terms.PROXIMO);
      model.set({cutOffDay: 20});
      assert.equal(model.calculateDueDate(startDateEarly).getTime(), thisDueDate.getTime());
      assert.equal(model.calculateDueDate(startDateMiddle).getTime(), thisDueDate.getTime());
      assert.equal(model.calculateDueDate(startDateLate).getTime(), nextDueDate.getTime());
    });

  /*
* XM.Terms should include a prototype function "calculateDiscountDate" that accepts a start date and returns a date by doing the following:
  > If the termsType is XM.Terms.DAYS then the due date is the start date + the terms discountDays
  > If the termsType is XM.Terms.PROXIMO then
    - If the start date day <= the terms cutoff day the discount day is discountDays day of the current month
    - Otherwise the due date is the discountDay day of the next month

* There should be a picker called XV.TermsTypePicker that references XM.termsTypes and does not show the "None" option.
* XM.TermsCollection based on XM.Collection class should exist.
* A cached collection called XM.terms should be created on application startup when Sales or Billing is installed.
* A List view that presents the XM.Terms collection sholud be exist in the core application.
* The list view should be added to setup by the Sales and Billing extensions.
* Tapping the new buttion in the list view should open a Terms Workspace backed by new XM.Terms object.
* Users with appropriate privileges should be able to create and edit Terms from the list.
* The "dueDays", "discountDays" and "cutoffDays" attributes should be mapped to spin boxes.
* When the terms type selected is XM.Terms.DAYS:
  > the dueDays spin box should allow values between 0 and 999
  > the label for dueDays should be "Due Days".
  > the label for discountDays should be "Discount Days".
* When the terms type selected is XM.Terms.PROXIMO
  > the dueDays spin box should allow values between 0 and 31.
  > the label for dueDays should be "Due Day."
  > the label for discountDays should be "Discount Day."
* The cutoffDays should map to a spin box allowing values between 0 and 31.
* A core Picker called XV.BillingTermsPicker sholud be created that only lists terms where "isUsedByBilling" is true.
* Workspaces for the following objects should use the XV.BillingTermsPicker: Customer, Prospect, Quote, Sales Order, Invoice, Return (Credit Memo).
*/

  };



  exports.additionalTests = additionalTests;

}());
