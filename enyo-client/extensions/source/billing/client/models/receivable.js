/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true, expr:true */
/*global XT:true, XM:true, _:true */

XT.extensions.billing.initReceivableModel = function () {
  'use strict';

  /**
   * @class XM.Receivable
   * @extends XM.Document
   */
  XM.Receivable = XM.Document.extend({
    recordType: 'XM.Receivable',
    idAttribute: 'uuid',
    documentKey: 'documentNumber',
    numberPolicySetting: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        currency: XT.baseCurrency()
      };
    },

    // * When customer is set on XM.Receivable the terms, currency, and salesRep should be copied from the customer and commission should be recalculated.
    // * When the amount is changed commission should be recalculated as customer.commission * amount.
    // * When the document date or terms is changed the dueDate sholud be recalculated using the terms "calculateDueDate" function.
    // * When the status of a receivable changes to READY_CLEAN, the following attributes should be changed to read only:
    //   > customer
    //   > documentDate
    //   > documentType
    //   > documentNumber
    //   > terms
    // * When child tax records are added or removed, the taxTotal should be recalculated.

    // * Validation
    //   > The amount must be greater than zero.
    //   > The taxTotal may not be greater than the amount.
  });

  XM.ReceivableMixin = {
    /**
      * Returns a boolean true if the value the documentType attribute
      * is XM.Receivable.DEBIT_MEMO or XM.Receivable.INVOICE, otherwise false
      * @returns {Boolean}
    */
    isDebit: function () {
      if (this.get("documentType") === XM.Receivable.DEBIT_MEMO ||
        this.get("documentType") === XM.Receivable.INVOICE) {
        return true;
      }
      return false;
    },

    /**
      * Returns a boolean true if the value the documentType attribute
      * is XM.Receivable.CREDIT_MEMO or XM.Receivable.INVOICE, otherwise false
      * @returns {Boolean}
    */
    isCredit: function () {
      if (this.get("documentType") === XM.Receivable.CREDIT_MEMO ||
        this.get("documentType") === XM.Receivable.INVOICE) {
        return true;
      }
      return false;
    }
  };

  XM.Receivable = XM.Receivable.extend(XM.ReceivableMixin);

  _.extend(XM.Receivable, {
    /** @scope XM.Receivable */

    // ..........................................................
    // CONSTANTS
    //

    /**
      @static
      @constant
      @type String
      @default I
    */
    INVOICE: 'I',

    /**
      @static
      @constant
      @type String
      @default D
    */
    DEBIT_MEMO: 'D',

    /**
      @static
      @constant
      @type String
      @default C
    */
    CREDIT_MEMO: 'C',

    /**
      @static
      @constant
      @type String
      @default R
    */
    CUSTOMER_DEPOSIT: 'R'

  });

  XM.ReceivableTax = XM.Model.extend({
    recordType: 'XM.ReceivableTax'
  });

};
