/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert,
    model;

  /**
    Terms are used to determine the billing Terms for Accounts Payable and Accounts Receivable.
    @class
    @alias Terms
  */
  var spec = {
    recordType: "XM.Terms",
    collectionType: "XM.TermsCollection",
    cacheName: "XM.terms",
    listKind: "XV.TermsList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "cutOffDay", "description", "dueDays", "discountDays", "discountPercent",
      "isUsedByBilling", "isUsedByPayments", "termsType"],
    defaults: {
      dueDays: 0,
      discountDays: 0,
      cutOffDay: 0,
      isUsedByBilling: false,
      isUsedByPayments: false,
      termsType: "D"
    },
    extensions: ["billing", "sales"],
    privileges: {
      createUpdateDelete: "MaintainTerms",
      read: true
    },
    createHash: {
      code: "TestTerms" + Math.random(),
      description: "Test Terms"
    },
    updatableField: "description"
  };

  var additionalTests = function () {
    /**
      @member -
      @memberof Terms.prototype
      @description The Terms type will contain Days
    */
    it("has the terms type constant DAYS", function () {
      assert.equal(XM.Terms.DAYS, "D");
    });

    /**
      @member -
      @memberof Terms.prototype
      @description The Terms type will contain Proximo
    */
    it("has the terms type constant PROXIMO", function () {
      assert.equal(XM.Terms.PROXIMO, "P");
    });

    /**
      @member -
      @memberof Terms.prototype
      @description Terms Type Days should be allowed to be set.
    */
    it("when the terms type is set to DAYS", function (done) {
      var initComplete = function () {
        model.set(spec.createHash);
        model.set("termsType", XM.Terms.DAYS);
        done();
      };

      model = new XM.Terms();
      model.on("statusChange", initComplete);
      model.initialize(null, {isNew: true});
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When terms type is Days, Due Days will be a positive number.
    */
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

    /**
      @member -
      @memberof Terms.prototype
      @description When terms type is Days, the Cut Off Day is Read-Only.
    */
    it("the cutOffDay should be set to read only = true", function () {
      assert.equal(model.isReadOnly("cutOffDay"), true);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description The Terms type Proximo should be allowed to be set.
    */
    it("when the terms type is set to PROXIMO", function () {
      model.set("termsType", XM.Terms.PROXIMO);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When terms type is Proximo, the Due Date is set to 1.
    */
    // TODO: these proximo tests should be nested inside
    it("the dueDay attribute should change to 1", function () {
      assert.equal(model.get("dueDays"), 1);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When terms type is Proximo, the Discount Day is set to 1.
    */
    it("the discountDay attribute should change to 1", function () {
      assert.equal(model.get("discountDays"), 1);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When terms type is Proximo, the Cut Off Day is editable.
    */
    it("cutOffDay should be set to read only = false", function () {
      assert.equal(model.isReadOnly("cutOffDay"), false);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When term type is Proximo, the Cut Off Day will allow values between and including 0 and 31.
    */
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

    /**
      @member -
      @memberof Terms.prototype
      @description When term type is Proximo, the Due Date will allow values between and including 0 and 31.
    */
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

    /**
      @member -
      @memberof Terms.prototype
      @description There will be a drop-down that contains the default Terms (Days & Proximo).
    */
    it("There should be a collection of static XM.termsTypes using the above 2 constants", function () {
      assert.isDefined(XM.termsTypes);
      assert.equal(XM.termsTypes.length, 2);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description Terms uses a function call calculateDueDate().
    */
    // TODO: nest in require
    it("XM.Terms should include a prototype function calculateDueDate() that accepts a start date " +
        "and returns a date by doing the following:", function () {
      assert.isDefined(model.calculateDueDate);
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When the Term type is Days, the due date is the Start Date plus the terms Due Days.
    */
    it("If the termsType is XM.Terms.DAYS then the due date is the start date + the terms dueDays", function () {
      var startDate = new Date("5/12/13"),
        nextWeek = new Date("5/19/13");

      model.set("termsType", XM.Terms.DAYS);
      model.set({dueDays: 7});
      assert.equal(model.calculateDueDate(startDate).getTime(), nextWeek.getTime());
    });

    /**
      @member -
      @memberof Terms.prototype
      @description When the Term type is Proximo, if the start date is less than the terms cutoff date then the due date is the Due Days of the current month.
    */
    /**
      @member -
      @memberof Terms.prototype
      @description When the Term type is Proximo, if the start date is greater than the terms cutoff date then the due date is the Due Days of the next month.
    */
    it("If the termsType is XM.Terms.PROXIMO then " +
        "If the start date day <= the terms cutoff day the due date is the dueDays day of the current month " +
        "Otherwise the due date is the dueDays day of the next month", function () {
      var startDateEarly = new Date("5/12/13"),
        startDateMiddle = new Date("5/20/13"),
        startDateLate = new Date("5/22/13"),
        thisDueDate = new Date("5/25/13"),
        nextDueDate = new Date("6/25/13");

      model.set("termsType", XM.Terms.PROXIMO);
      model.set({cutOffDay: 20});
      model.set({dueDays: 25});
      assert.equal(model.calculateDueDate(startDateEarly).getTime(), thisDueDate.getTime());
      assert.equal(model.calculateDueDate(startDateMiddle).getTime(), thisDueDate.getTime());
      assert.equal(model.calculateDueDate(startDateLate).getTime(), nextDueDate.getTime());
    });

    /**
      @member -
      @memberof Terms.prototype
      @description Terms uses a function called calculateDiscountDate().
    */
    it("XM.Terms should include a prototype function calculateDiscountDate() that accepts a start date " +
        "and returns a date by doing the following:", function () {
      assert.isDefined(model.calculateDiscountDate);
    });
    it("If the termsType is XM.Terms.DAYS then the discount date is the start date + the terms discountDays", function () {
      var startDate = new Date("5/12/13"),
        nextWeek = new Date("5/19/13");

      model.set("termsType", XM.Terms.DAYS);
      model.set({dueDays: 7});
      assert.equal(model.calculateDueDate(startDate).getTime(), nextWeek.getTime());
    });
    it("If the termsType is XM.Terms.PROXIMO then " +
        "If the start date day <= the terms cutoff day the due date is the discountDays day of the current month " +
        "Otherwise the discount date is the discountDays day of the next month", function () {
      var startDateEarly = new Date("5/12/13"),
        startDateMiddle = new Date("5/19/13"),
        startDateLate = new Date("5/22/13"),
        thisDiscountDate = new Date("5/24/13"),
        nextDiscountDate = new Date("6/24/13");

      model.set("termsType", XM.Terms.PROXIMO);
      model.set({cutOffDay: 19});
      model.set({discountDays: 24});
      assert.equal(model.calculateDiscountDate(startDateEarly).getTime(), thisDiscountDate.getTime());
      assert.equal(model.calculateDiscountDate(startDateMiddle).getTime(), thisDiscountDate.getTime());
      assert.equal(model.calculateDiscountDate(startDateLate).getTime(), nextDiscountDate.getTime());
    });
    it("There should be a picker called XV.TermsTypePicker that references " +
        "XM.termsTypes and does not show the \"None\" option", function () {
      var picker;

      assert.isDefined(XV.TermsTypePicker);
      picker = new XV.TermsTypePicker();
      assert.equal(picker.getCollection(), "XM.termsTypes");
      assert.isFalse(picker.getShowNone());
    });
    it("XM.TermsCollection based on XM.Collection class should exist", function () {
      assert.isDefined(XM.TermsCollection);
      //assert.isTrue(XM.TermsCollection instanceof XM.Collection);
    });
    // TODO: rehab this not using smoke, which crashes subsequent tests
    it.skip("When the terms type selected is XM.Terms.DAYS", function (done) {
      smoke.navigateToNewWorkspace(XT.app, "XV.TermsList", function (workspaceContainer) {
        workspaceContainer.$.workspace.value.set({termsType: XM.Terms.DAYS});
        done();
      });
    });
    // TODO: The "dueDays", "discountDays" and "cutoffDays" attributes should be mapped to spin boxes.
    // TODO: the dueDays spin box should allow values between 0 and 999
    it.skip("the label for dueDays should be 'Due Days'", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.equal(workspace.$.dueDays.$.label.getContent(), XT.String.loc("_dueDays") + ":");
    });
    it.skip("the label for discountDays should be 'Discount Days'", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.equal(workspace.$.discountDays.$.label.getContent(),
        XT.String.loc("_discountDays") + ":");
    });
    it.skip("The cutoffDay widget should be hidden", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.isFalse(workspace.$.cutOffDay.getShowing());
    });
    it.skip("When the terms type selected is XM.Terms.PROXIMO", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      workspace.value.set({termsType: XM.Terms.PROXIMO});
    });
    it.skip("The cutoffDay widget should be visible", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.isTrue(workspace.$.cutOffDay.getShowing());
    });
    // TODO: the dueDays spin box should allow values between 0 and 31.
    // TODO: The cutoffDays should map to a spin box allowing values between 0 and 31.
    it.skip("the label for dueDays should be 'Due Day'", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.equal(workspace.$.dueDays.$.label.getContent(), XT.String.loc("_dueDay") + ":");
    });
    it.skip("the label for discountDays should be 'Discount Day'", function () {
      var workspace = XT.app.$.postbooks.getActive().$.workspace;
      assert.equal(workspace.$.discountDays.$.label.getContent(),
        XT.String.loc("_discountDay") + ":");
    });
    // XXX TODO
    it.skip("A core Picker called XV.BillingTermsPicker should be created that only lists " +
        "terms where 'isUsedByBilling' is true", function () {
      var picker;
      assert.isDefined(XV.BillingTermsPicker);

      picker = new XV.BillingTermsPicker();
      _.each(picker._collection.models, function (model) {
        assert.isTrue(model.get("isUsedByBilling"));
      });
    });
    it("Workspaces for the following objects should use the XV.BillingTermsPicker: " +
        "Customer, Quote, Sales Order, Invoice, Return (Credit Memo)", function () {
      var workspaces = ["XV.CustomerWorkspace", "XV.QuoteWorkspace",
        "XV.SalesOrderWorkspace", /* TODO "XV.InvoiceWorkspace", "XV.ReturnWorkspace" */];

      _.each(workspaces, function (workspaceName) {
        var Klass = XT.getObjectByName(workspaceName),
          workspace = new Klass();

        assert.isTrue(_.contains(_.map(workspace.$, function (widget) {
          return widget.kind;
        }), "XV.BillingTermsPicker"));
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
