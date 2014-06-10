/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Terms = XM.Document.extend({
    /** @scope XM.Terms.prototype */

    recordType: 'XM.Terms',

    documentKey: 'code',

    enforceUpperKey: false,

    defaults: function () {
      return {
        dueDays: 0,
        discountDays: 0,
        cutOffDay: 0,
        isUsedByBilling: false,
        isUsedByPayments: false,
        termsType: XM.Terms.DAYS
      };
    },

    /**
      Bind on termsType and kick off that bound function at the outset to apply defaults
     */
    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on("change:termsType", this.termsTypeDidChange);
      this.termsTypeDidChange();
    },

    /**
      If the termsType is XM.Terms.DAYS then the due date is the start date + the terms discountDays
      If the termsType is XM.Terms.PROXIMO then
        - If the start date day <= the terms cutoff day the discount day is discountDays day of the current month
        - Otherwise the due date is the discountDay day of the next month
    */
    calculateDiscountDate: function (startDate) {
      var termsType = this.get("termsType"),
        returnDate = startDate,
        cutOffDay = this.get("cutOffDay"),
        discountDays = this.get("discountDays");

      if (termsType === XM.Terms.DAYS) {
        returnDate.setDate(returnDate.getDate() + this.get("dueDays"));
      } else if (termsType === XM.Terms.PROXIMO && returnDate.getDate() <= cutOffDay) {
        // we made the cut-off date, so return this month
        returnDate.setDate(discountDays);
      } else if (termsType === XM.Terms.PROXIMO) {
        // we did not make the cut-off date, so return next month
        returnDate.setMonth(returnDate.getMonth() + 1);
        returnDate.setDate(discountDays);
      }
      return returnDate;
    },

    /**
      If the termsType is XM.Terms.DAYS then the due date is the start date + the terms dueDays
      If the termsType is XM.Terms.PROXIMO then
        - If the start date day <= the terms cutoff day the due date is the dueDays day of the current month
        - Otherwise the due date is the dueDays day of the next month
    */
    calculateDueDate: function (startDate) {
      var termsType = this.get("termsType"),
        returnDate = new Date(startDate.getTime()),
        cutOffDay = this.get("cutOffDay"),
        dueDays = this.get("dueDays");

      if (termsType === XM.Terms.DAYS) {
        returnDate.setDate(returnDate.getDate() + this.get("dueDays"));
      } else if (termsType === XM.Terms.PROXIMO && returnDate.getDate() <= cutOffDay) {
        // we made the cut-off date, so return this month
        returnDate.setDate(dueDays);
      } else if (termsType === XM.Terms.PROXIMO) {
        // we did not make the cut-off date, so return next month
        returnDate.setMonth(returnDate.getMonth() + 1);
        returnDate.setDate(dueDays);
      }
      return returnDate;
    },

    termsTypeDidChange: function (model, termsType) {

      this.setReadOnly("cutOffDay", termsType !== XM.Terms.PROXIMO);

      if (termsType === XM.Terms.DAYS) {
        this.set("dueDays", 0);
        this.set("discountDays", 0);
      } else if (termsType === XM.Terms.PROXIMO) {
        this.set("dueDays", 1);
        this.set("discountDays", 1);
      }
    },

    /**
      Enforce dueDate rules based on terms type. Otherwise validate per usual.
     */
    validate: function (attributes) {
      var dueDays = this.get("dueDays"),
        cutOffDay = this.get("cutOffDay"),
        params;

      if (this.get("termsType") === XM.Terms.DAYS) {
        if (!_.isNumber(dueDays) || dueDays % 1 !== 0 || dueDays < 0) {
          params = {attr: "_dueDays".loc(), value: dueDays};
          return XT.Error.clone('xt1013', { params: params });
        }
      } else if (this.get("termsType") === XM.Terms.PROXIMO) {
        if (!_.isNumber(dueDays) || dueDays % 1 !== 0 || dueDays < 0 || dueDays > 31) {
          params = {attr: "_dueDays".loc(), value: dueDays};
          return XT.Error.clone('xt1013', { params: params });
        }
        if (!_.isNumber(cutOffDay) || cutOffDay % 1 !== 0 || cutOffDay < 0 || cutOffDay > 31) {
          params = {attr: "_cutOffDay".loc(), value: cutOffDay};
          return XT.Error.clone('xt1013', { params: params });
        }
      }

      return XM.Model.prototype.validate.apply(this, arguments);
    }

  });

  _.extend(XM.Terms, {

    DAYS: "D",

    PROXIMO: "P"

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TermsCollection = XM.Collection.extend({
    /** @scope XM.TermsCollection.prototype */

    model: XM.Terms

  });


}());
