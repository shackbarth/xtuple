/* jshint -W065 *//* suppress radix parameter warning */
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
    enforceUpperKey: false,
    numberPolicySetting: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        isPosted: false,
        fundsType: XM.FundsType.CHECK,
        currency: XM.baseCurrency,
        currencyRatio: 1,
        applicationDate: new Date(),
        lineItems: new XM.CashReceiptLineCollection(),
        applied: 0,
        balance: 0
      };
    },

    handlers: {
      'status:READY_CLEAN': 'onReadyClean',
      'change:applied': 'appliedChanged',
      'change:amount': 'amountChanged',
      'change:customer': 'customerChanged',
      'change:currency': 'currencyChanged',
      'change:distributionDate': 'distributionDateChanged',
      'change:applicationDate': 'applicationDateChanged',
      'add': 'lineItemAdded'
    },

    /**
     * @listens change:applicationDate
     */
    applicationDateChanged: function () {
      this.dateChanged();
    },

    /**
     * @listens change:distributionDate
     */
    distributionDateChanged: function () {
      // TODO update currency ratio
      this.dateChanged();
    },

    /**
     * @listens change:applied
     */
    appliedChanged: function () {
      this._updateBalance();
    },

    /**
     * @listens change:amount
     */
    amountChanged: function () {
      this._updateBalance();
    },

    /**
     * @private
     * Calculate balance
     */
    _updateBalance: function () {

    },

    /**
     * @listens add:lineItem
     */
    lineItemAdded: function () {
      console.log('added');
      console.log(arguments);
    },

    /**
     * @listens status:READY_CLEAN
     */
    onReadyClean: function (model) {
      this.setReadOnly(this.get('isPosted'));
      this.setReadOnly([
        'amount',
        'fundsType',
        'documentNumber',
        'documentDate',
        'bankAccount',
        'distributionDate',
        'applicationDate'
      ], this.isCreditCard());
    },

    /**
     * @listens change:customer
     */
    customerChanged: function (model, customer) {
      this.set({ currency: customer.get('currency') });
    },

    /**
     * @listens change:currency
     */
    currencyChanged: function (model, currency) {
      this.checkCurrency();
    },

    /**
     * The minimum date is earliest date on which any newly-added line item
     * could be valid. Returns the maximum documentDate of all receivables
     * associated with cash receipt line items, or XM.date.startOfTime() if no
     * line items exist.
     *
     * @returns {Date}
     */
    getMinimumDate: function () {
      _.max(this.lineItems.pluck('documentDate'));
    },

    /**
     * Warn and notify the user if the the cash receipt's currency does not
     * match the bank account's.
     */
    checkCurrency: function (callback) {
      var bankAccount = this.get('bankAccount'),
        bankAccountCurrency = bankAccount.get('currency').get('abbreviation'),
        cashReceiptCurrency = this.get('currency').get('abbreviation');

      if (bankAccountCurrency !== cashReceiptCurrency && this.meta.get('currencyWarning')) {
        this.notify(
          '_currencyMismatchWarning'.loc()
            .replace('{cr_currency}', cashReceiptCurrency)
            .replace('{ba_currency}', bankAccountCurrency),
          { callback: callback }
        );
        this.meta.set({ currencyWarning: false });
      }
      else if (_.isFunction(callback)) {
        callback(true);
      }

      return this;
    },

    /**
     * Update derivative date values on change.
     * @see XM.CashReceipt#applicationDateChanged
     * @see XM.CashReceipt#distributionDateChanged
     */
    dateChanged: function () {
      var minDate = this.getMinimumDate(),
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
     * Create a new CashReceiptLine on the provided CashReceiptReceivable
     */
    applyAmount: function (receivable, amount, discountAmount) {
      this.lineItems.add(new XM.CashReceiptLine({
        receivable: receivable,
        amount: amount,
        discountAmount: discountAmount
      }));
    },

    /**
     * @private
     * @see XM.CashReceipt#applyLineBalance
     *
     * Validate applyLineBalance preconditions.
     */
    _applyLineBalance: function (receivable, options, _step) {

      if (receivable.isDebit() && this.get('balance') === 0) {
        return options.error('_noApplicableCashReceiptBalance'.loc());
      }

      var that = this,
        step = _step || 'checkCurrency',
        plan = {

          /**
           * 1. Validate the currency.
           */
          checkCurrency: function () {
            return that.checkCurrency(function (valid) {
              if (!valid) { return; }
              that._applyLineBalance(receivable, options, 'convertCurrency');
            });
          },

          /**
           * 2. Continue after we've converted the receivable's currency to that of
           * this cash receipt.
           */
          convertCurrency: function () {
            return receivable.get('currency').toCurrency(
              that.get('currency'),
              receivable.get('balance'),
              that.get('distributionDate'), {
                success: function (convertedValue) {
                  that._applyLineBalance(receivable, options, 'fetchReceivable');
                },
                error: function () {
                  options.error('_currencyConversionError'.loc());
                }
              });
          },
          
          /**
           * 3. Fetch/lock Receivable to edit, ensure lock is acquired, pass
           * back to caller.
           */
          fetchReceivable: function () {
            receivable.fetch({
              success: function (model) {
                if (!model.getLockKey()) {
                  options.error('locked');  // TODO
                }
                else {
                  options.success(model);
                }
              },
              error: options.error
            });
          }
        };

      return plan[step]();
    },

    /**
     * Apply cash receipt balance to the receivable.
     *
     * @param receivable
     * @param callback
     */
    applyLineBalance: function (_receivable, callback) {
      var that = this, options = {
        
        /**
         * Apply line balance once preconditions are met
         *
         * @callback
         */
        success: function (receivable) {
          var terms = receivable.get('terms'),
            application = _.extend(
              this._calculateReceivableApplication(receivable), {
              receivable: receivable
            }),
            line = new XM.CashReceiptLine(application),
            pending = new XM.CashReceiptLinePending(application)
          ;

          receivable.get('pendingApplications').add(pending);
          this.get('lineItems').add(line);
          // TODO trigger date check

          callback();
        },
        error: function () {
          // TODO throw error
        }
      };

      this._applyLineBalance(_receivable, options);
      return this;
    },

    /**
     * Return the discounted amount of one a receivable for this cash receipt.
     */
    _calculateReceivableApplication: function (receivable) {
      if (!receivable.isDebit()) {
        return null;
      }

      var terms = receivable.get('terms'),
        docDate = this.get('documentDate'),
        discDate = terms ? terms.calculateDiscountDate(docDate) : 0,
        balance = receivable.get('balance'),
        value = this.get('balance'),
        discount = terms ? terms.get('discountPercent') : 0.0,
        payoff = balance >= (value - (balance * discount)),

        discountAmount = XT.math.round(payoff ?
          balance * discount :
          value / (1 - discount),
        XT.MONEY_SCALE),

        applyAmount = XT.math.round(payoff ?
          balance - (balance * discount) :
          value
        );

      return {
        applyAmount: applyAmount,
        discountAmount: discountAmount
      };
    },

    /**
     * Apply the entire balance to the receivables
     * @see XM.CashReceiptReceivablesCollection#comparator
     */
    applyBalance: function (_receivables, applyCredits, callback) {
      var that = this,
        credits = applyCredits ? _receivables.getCredits() : [ ],
        debits = _receivables.getDebits(),
        receivables = _.union(credits, debits),
        index = 0,
        applyEach = function () {
          while (that.get('balance') > 0) {
            return that.applyLineBalance(receivables[index++], applyEach);
          }
        };

      return applyEach();
    },

    /**
     * Removes a line item
     */
    clearLine: function (receivable) {
      var lines = this.get('lineItems');
      lines.remove(lines.where({ receivable: receivable }));
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
      discountAmount: 0
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
  XM.CashReceiptReceivable = XM.Receivable.extend({
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
   * @class XM.CashReceiptCollection
   * @extends XM.Collection
   */
  XM.CashReceiptCollection = XM.Collection.extend({
    model: XM.CashReceipt
  });

  /**
   * @class XM.CashReceiptLineCollection
   * @extends XM.Collection
   */
  XM.CashReceiptLineCollection = XM.Collection.extend({
    model: XM.CashReceiptLine
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
    model: XM.CashReceiptReceivable,

    /**
     * Comparator for determining the order in which receivables will have
     * cash receipts applied to them.
     *
     * Sort by dueDate, then documentNumber
     */
    comparator: function (receivable) {
      return 0 - parseInt(
        String(receivable.get('dueDate').valueOf()) +
        String(receivable.get('documentNumber'))
      );
    },

    /**
     * Return list of receivables where isCredit() === true
     */
    getCredits: function () {
      return this.where({ documentType: XM.Receivable.CREDIT_MEMO });
    },
    /**
     * Return list of receivables where isDebit() === true
     */
    getDebits: function () {
      return this.where({ documentType: XM.Receivable.DEBIT_MEMO });
    }
  });
};
