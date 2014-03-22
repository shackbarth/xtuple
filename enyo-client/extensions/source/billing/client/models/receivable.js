/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true, expr:true */
/*global XT:true, XM:true, _:true, Globalize:true */

XT.extensions.billing.initReceivableModel = function () {
  'use strict';

  /**
   * @class XM.Receivable
   * @extends XM.Document
   */
  XM.Receivable = XM.Document.extend({
    recordType: 'XM.Receivable',
    idAttribute: 'uuid',
    nameAttribute: 'documentNumber',
    documentKey: 'documentNumber',
    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        currency: XT.baseCurrency(),
        balance: 0,
        taxTotal: 0
      };
    },

    readOnlyAttributes: [
      "balance",
      "taxTotal",
      "paid",
      "commission"
    ],

    // ..........................................................
    // METHODS
    //

    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:amount', this.amountDidChange);
      this.on('change:customer', this.customerDidChange);
      this.on('change:documentDate change:terms', this.documentDateDidChange);
      this.on('change:paid', this.paidDidChange);
      this.on('statusChange', this.statusDidChange);
      this.on('add:taxes remove:taxes', this.taxesDidChange);
    },

    /**
      When the amount is changed, commission should be recalculated
    */
    amountDidChange: function () {
      this.set("commission", this.calculateCommission());
      this.set("balance", this.calculateBalance());
    },
    /**
      When customer is set on XM.Receivable the terms, currency, and salesRep
       should be copied from the customer and commission should be recalculated
    */
    customerDidChange: function () {
      this.copyFromCustomer();
      this.calculateCommission();
    },
    /**
      When the document date or terms is changed the dueDate should
       be recalculated using the terms "calculateDueDate" function
    */
    documentDateDidChange: function () {
      this.set("dueDate", this.calculateDueDate());
    },

    paidDidChange: function () {
      this.set("balance", this.calculateBalance());
    },
    /**
      When the status of a receivable changes to READY_CLEAN, the following attributes
       should be changed to read only: customer, documentDate, documentType,
       documentNumber, terms
    */
    statusDidChange: function () {
      var isEdit = this.getStatus() === XM.Model.READY_CLEAN;
      this.setReadOnly(["customer", "documentDate", "documentType",
        "documentNumber", "terms"], isEdit);
    },

    /**
      Called when a tax is added or removed
      @param {Object} model
    */
    taxesDidChange: function (model) {
      if (model) {
        // add listener for taxAmount change on new model
        model.on('change:taxAmount', this.taxAmountDidChange, this);
      } else {
        this.taxAmountDidChange();
      }
    },

    taxAmountDidChange: function () {
      this.set("taxTotal", this.calculateTaxTotal());
    },

    /**
      Calculated sum of taxes
    */
    calculateTaxTotal: function () {
      var taxes = this.get("taxes");
      if (!taxes || taxes.length === 0) {
        return 0;
      }
      var amounts = _.map(taxes.models, function (tax) { return tax.get("taxAmount") || 0; });
      return _.reduce(amounts, function (num, memo) {
        return num + memo;
      }, 0);
    },

    /**
      Calculated value of amount - paid
    */
    calculateBalance: function () {
      var amount = this.get("amount"),
        paid = this.get("paid");
      return amount - paid;
    },

    /**
      Commission should be re-calculated as customer.commission * amount
    */
    calculateCommission: function () {
      var customer = this.get("customer"),
        amount = this.get("amount");
      if (customer) {
        return customer.get("commission") * amount;
      }
      return 0;
    },

    /**
      Calculate due date using calculateDueDate function
      on Terms
    */
    calculateDueDate: function () {
      var terms = this.get("terms"),
        docDate = this.get("documentDate");
      if (terms && docDate) {
        return terms.calculateDueDate(docDate);
      }
      return null;
    },

    /**
      Copy the terms, currency, and salesRep from the
      customer
    */
    copyFromCustomer: function () {
      var customer = this.get("customer");
      if (customer) {
        this.set("terms", customer.get("terms"));
        this.set("currency", customer.get("currency"));
        this.set("salesRep", customer.get("salesRep"));
      } else {
        this.set("terms", null);
        this.set("currency", null);
        this.set("salesRep", null);
      }
    },

    /**
      Dispatches to database function to post credit memo
    */
    createCreditMemo: function (params, options) {
      return this.dispatch("XM.Receivable", "createCreditMemo", params, options);
    },
    /**
      Dispatches to database function to post debit memo
    */
    createDebitMemo: function (params, options) {
      return this.dispatch("XM.Receivable", "createDebitMemo", params, options);
    },

    /**
      If this is a new receivable, then this save performs validation and
      dispatches to post a credit or debit memo. If this is an update, it
      calls the typical model save.
    */
    save: function (key, value, options) {
      if (this.getStatus() === XM.Model.READY_NEW) {
        var that = this, taxes,
          recOptions = {},
          success, params,
          attrs;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (key === null || typeof key === 'object') {
          attrs = key;
          options = value;
        } else {
          (attrs = {})[key] = value;
        }

        options = _.extend({validate: true}, options);

        // Do not persist invalid models.
        if (!this._validate(attrs, options)) {
          return false;
        }

        success = options.success;
        taxes = that.get("taxes") ? that.get("taxes").models : null;
        // construct the array of tax objects to send as a parameter to
        // the dispatch function
        taxes = _.map(taxes, function (m) {
          return {
            taxAmount: m.get("taxAmount"),
            parent: m.get("tax").id,
            taxCode: m.get("taxCode").id,
            taxType: m.get("taxType") ? m.get("taxType").id : null,
            basis: m.get("basis"),
            percent: m.get("percent"),
            documentDate: m.get("documentDate"),
            uuid: m.id
          };
        });
        // array of parameters, including taxes, to send to dispatch function
        params = [
          that.id,
          that.get("customer").id,
          that.get("documentNumber"),
          that.get("documentDate"),
          that.get("amount"),
          that.get("dueDate"),
          that.get("currency").id,
          XM.currencyRates.getScalarRate('to base from', that.get("currency"), that.get("documentDate")),
          that.get("commission"),
          that.get("orderNumber"),
          that.get("notes"),
          that.get("terms") ? that.get("terms").id : null,
          that.get("reasonCode") ? that.get("reasonCode").id : null,
          that.get("salesRep") ? that.get("salesRep").id : null,
          that.get("paid"),
          taxes
        ];

        recOptions.success = function (resp) {
          that.setStatus(XM.Model.READY_CLEAN, options);
          if (success) { success(that, resp, options); }
        };
        recOptions.error = function () {};

        if (this.isCredit()) {
          // the tax amount should be negative for credit memos
          _.each(params.taxes, function (t) { t.taxAmount = -Math.abs(t.taxAmount); });
          this.createCreditMemo(params, recOptions);
        } else if (this.isDebit()) {
          this.createDebitMemo(params, recOptions);
        }
        return this;
      }
      return XM.Model.prototype.save.call(this, key, value, options);
    },

    /**
      The amount must be greater than zero
      The taxTotal may not be greater than the amount
    */
    validate: function () {
      var amount = this.get("amount") || 0,
        taxTotal = this.get("taxTotal") || 0,
        currency = this.get("currency"),
        documentDate = this.get("documentDate"),
        currencyRate,
        params = {}, error;

      error = XM.Document.prototype.validate.apply(this, arguments);
      if (error) { return error; }

      currencyRate = XM.currencyRates.getScalarRate('to base from',
        currency, documentDate);
      if (!currencyRate || isNaN(currencyRate)) {
        params.currency = currency.get("abbreviation");
        params.asOf = Globalize.format(documentDate, "d");
        return XT.Error.clone('xt2010', { params: params});
      }

      if (amount <= 0) {
        params = {attr: "_amount".loc(), value: amount};
        return XT.Error.clone('xt1013', { params: params });
      }

      if (Math.max(taxTotal, amount) === taxTotal) {
        return XT.Error.clone('xt2024');
      }

      return;
    }

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

  /**
    @class XM.ReceivableTax

    @extends XM.Model
  */
  XM.ReceivableTax = XM.Model.extend({
    recordType: 'XM.ReceivableTax',
    idAttribute: "uuid",

    defaults: function () {
      return {
        basis: 0,
        percent: 0,
        amount: 0
      };
    },

    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:tax', this.parentDidChange);
      this.on('statusChange', this.statusDidChange);
    },

    parentDidChange: function () {
      var parent = this.get("tax");
      this.set("documentDate", parent.get("documentDate"));
    },

    statusDidChange: function () {
      var isEdit = this.getStatus() === XM.Model.READY_CLEAN;
      this.setReadOnly(["taxCode", "taxAmount"], isEdit);
    },
  });

  /**
    @class XM.ReceivableApplication

    @extends XM.Model
  */
  XM.ReceivableApplication = XM.Model.extend({
    recordType: 'XM.ReceivableApplication',
    idAttribute: "uuid"
  });

  /**
    @class XM.ReceivableListItem

    @extends XM.Model
  */
  XM.ReceivableListItem = XM.Info.extend({
    recordType: 'XM.ReceivableListItem',
    idAttribute: "uuid",
    editableModel: 'XM.Receivable',

    canOpen: function (callback) {
      if (callback) { callback(this.get("isPosted")); }

      return this;
    },
  });

  XM.ReceivableRelation = XM.Model.extend({
    recordType: 'XM.ReceivableRelation',
    idAttribute: 'uuid'
  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.ReceivableRelationCollection = XM.Collection.extend({
    model: XM.ReceivableRelation
  });

  /**
    @class XM.ReceivableListItemCollection

    @extends XM.Collection
  */
  XM.ReceivableListItemCollection = XM.Collection.extend({
    /** @scope XM.ReceivableListItemCollection.prototype */

    model: XM.ReceivableListItem

  });

  /**
    @class XM.ReceivableTaxCollection

    @extends XM.Collection
  */
  XM.ReceivableTaxCollection = XM.Collection.extend({
    /** @scope XM.ReceivableTaxCollection.prototype */

    model: XM.ReceivableTax

  });

  /**
    @class XM.ReceivableApplicationCollection

    @extends XM.Collection
  */
  XM.ReceivableApplicationCollection = XM.Collection.extend({
    /** @scope XM.ReceivableTaxCollection.prototype */

    model: XM.ReceivableApplication

  });


};
