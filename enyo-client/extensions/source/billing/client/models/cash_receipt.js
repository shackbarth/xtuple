XT.extensions.billing.initCashReceipt = function () {
  'use strict';

  /**
   * @class XM.CashReceipt
   * @extends XM.Document
   */
  XM.CashReceipt = XM.Document.extend({
    recordType: 'XM.CashReceipt',
    idAttribute: 'number',
    documentKey: 'number',
    numberPolicySetting: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        isPosted: false,
        fundsType: XM.FundsType.CHECK
      };
    },

    handlers: {
      'status:READY_CLEAN': 'onReadyClean',
      'change:customer': 'customerChanged',
      'change:currency': 'currencyChanged',
      'change:distributionDate': 'dateChanged',
      'change:applicationDate': 'dateChanged'
    },

    /**
     * @listens status:READY_CLEAN
     */
    onReadyClean: function (model) {

    },
    
    /**
     * @listens change:customer
     */
    customerChanged: function (model, value) {

    },

    /**
     * @listens change:currency
     */
    currencyChanged: function (model, value) {

    },

    /**
     * @public
     * Return the maximum documentDate of all receivables associated with cash
     * receipt line items, or XM.date.startOfTime() if no line items exist.
     */
    minimumDate: function () {

    },

    /**
     * Warn and notify the user if the the cash receipt's currency does not
     * match the bank account's.
     */
    checkCurrency: function (callback) {
      var bankAccount = this.get('bankAccount');

      if (this.meta.get('currencyWarning')) {
        this.notify('_currencyMismatchWarning', { callback: callback });
      }

      callback(true);
      return this;
    },

    /**
     * @public
     * Update derivative date values on change.
     */
    dateChanged: function () {
      var minDate = this.minimumDate(),
        applicationDate = this.get("applicationDate"),
        distributionDate = this.get("distributionDate");
      if (applicationDate < minDate) {
        this.set("applicationDate", minDate);
      }
      if (distributionDate > applicationDate) {
        this.set("distributionDate", applicationDate);
      }
    },

    /**
     * @public
     * Create a new CashReceiptLine on the provided CashReceiptReceivable
     */
    applyAmount: function (receivable, amount, discount) {


    },

    applyLineBalance: function (receivable) {

    },

    applyBalance: function (receivables, includeCredit) {

    }

  });

  /**
   * @class XM.CashReceiptLine
   * @extends XM.Model
   */
  XM.CashReceiptLine = XM.Model.extend({
    recordType: 'XM.CashReceiptLine',
    idAttribute: 'uuid',

    defaults: {
      amount: 0,
      discount: 0
    }
  });

  /**
   * @class XM.CashReceiptLinePending
   * @extends XM.Model
   */
  XM.CashReceiptLinePending = XM.Model.extend({
    recordType: 'XM.CashReceiptLinePending',
    idAttribute: 'uuid'
  });

  /**
   * @class XM.CashReceiptReceivable
   * @extends XM.Model
   * @mixes XM.ReceivableMixin
   */
  XM.CashReceiptReceivable = XM.Model.extend({
    // mixins: [ XM.ReceivableMixin ],
    recordType: 'XM.CashReceiptReceivable',
    idAttribute: 'uuid'
  });
  XM.CashReceiptReceivable = XM.CashReceiptReceivable.extend(XM.ReceivableMixin);

  /**
   * @class XM.CashReceiptListItem
   * @extends XM.Info
   * @see XM.CashReceipt
   */
  XM.CashReceiptListItem = XM.Info.extend({
    recordType: 'XM.CashReceiptListItem',
    idAttribute: 'number',
    editableModel: 'XM.CashReceipt',

    canPost: function (callback) {
      callback(false);
    },
    canVoid: function (callback) {
      callback(false);
    },
    canDelete: function (callback) {
      callback(false);
    }
  });

  /**
   * @class XM.CashReceipt
   * @extends XM.Collection
   */
  XM.CashReceiptCollection = XM.Collection.extend({
    model: XM.CashReceipt
  });

  /**
   * @class XM.CashReceiptListItemCollection
   * @extends XM.Collection
   */
  XM.CashReceiptListItemCollection = XM.Collection.extend({
    model: XM.CashReceiptListItem
  });


  /**
   * @class XM.CashReceiptReceivablesCollection
   * @extends XM.Collection
   */
  XM.CashReceiptReceivablesCollection = XM.Collection.extend({
    model: XM.CashReceiptReceivable
  });
};
