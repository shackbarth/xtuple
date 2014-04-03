/* jshint -W065 *//* suppress radix parameter warning */
XT.extensions.billing.initCashReceipt = function () {
  'use strict';

  /**
   * @mixin CashReceiptMixin
   */
  XM.CashReceipt = XM.Document.extend({
    recordType: 'XM.CashReceipt',
    idAttribute: 'number',
    documentKey: 'number',
    documentDateKey: 'documentDate',
    enforceUpperKey: false,
    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: function () {
      this.meta = new Backbone.Model();
      return {
        isPosted: false,
        fundsType: XM.CashReceipt.CHECK,
        useCustomerDeposit: false,
        currency: XM.baseCurrency,
        currencyRate: 1.0,
        documentDate: new Date(),
        amount: 0,
        appliedAmount: 0,
        balance: 0
      };
    },

    readOnlyAttributes: [
      'balance',
      'appliedAmount',
      'currencyRate'
    ],

    handlers: {
      'status:READY_CLEAN': 'onReadyClean',
      'change:appliedAmount': 'updateBalance',
      'change:amount': 'updateBalance',
      'change:customer': 'customerChanged',
      'change:currency': 'currencyChanged',
      'change:distributionDate': 'distributionDateChanged',
      'change:applicationDate': 'dateChanged',
      'change:useCustomerDeposit': 'useCustomerDepositChanged',
      'add': 'lineItemAdded'
    },

    useCustomerDepositChanged: function () {
      // XXX our picker widget still doesn't work correctly with booleans. you
      // can set this value, but it cannot render. fix later, need to submit
      // pull nownownow. i thought i had fixed this awhile ago but it seems to
      // not be as of now.
      this.attributes.useCustomerDeposit = (this.get('useCustomerDeposit') === '1');
    },

    /**
     * XXX error if i try to override this method
     * Uncaught TypeError: Cannot read property 'patches' of null
     *
    toJSON: function () {
      console.log(this.attributes);
      // cast useCustomerDeposit to boolean
      this.attributes.useCustomerDeposit = (this.get('useCustomerDeposit') === '1');
      XM.Document.prototype.toJSON.apply(this, arguments);
    },
    */

    /**
     * @listens change:distributionDate
     */
    distributionDateChanged: function () {
      // TODO update currency rate
      this.dateChanged();
      this.checkCurrency();
    },

    /**
     * Updates the derived appliedAmount value, which is the sum of all line
     * item applied amounts.
     */
    updateAppliedAmount: function () {
      var appliedAmount = _.reduce(this.get('lineItems'), function (memo, line) {
        return memo + line.get('appliedAmount');
      }, 0);
      this.set('appliedAmount', appliedAmount);
    },

    /**
     * @protected
     * @listens change:applied
     * @listens change:amount
     */
    updateBalance: function () {
      this.set({ balance: this.get('amount') - this.get('appliedAmount') });
    },

    /**
     * @listens add:lineItem
     */
    lineItemAdded: function () {
      // TODO updated appliedAmount here
      console.log('added');
      console.log(arguments);
    },

    /**
     * @listens status:READY_CLEAN
     */
    onReadyClean: function (model) {
      /*
       * TODO re-enable
      this.setReadOnly(this.get('isPosted'));
      */
      this.setReadOnly([
        'amount',
        'fundsType',
        'documentNumber',
        'documentDate',
        'bankAccount',
        'distributionDate',
        'applicationDate'
      ], XM.fundsTypes.get(this.get('fundsType')).isCreditCard());
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
      var that = this;
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
      return this.lineItems ?
        _.max(this.lineItems.pluck('documentDate')) : XT.date.startOfTime();
    },

    /**
     * Check currencies and notify the user if the the cash receipt's currency
     * does not match the bank account's.
     */
    checkCurrency: function (_callback) {
      var that = this,
        callback = function (ok) {
          var previousCurrency = that.previousAttributes().currency;

          if (!ok) {
            // XXX
            console.log('canceled currency change from '+ previousCurrency +
              ' to '+ that.get('currency'));

            that.set({ currency: previousCurrency });
          }

          if (_.isFunction(_callback)) {
            _callback(ok);
            return that;
          }
        },
        bankAccount = this.get('bankAccount'),
        bankAccountCurrency,
        cashReceiptCurrency;

      if (!this.get('bankAccount')) {
        return callback(true);
      }

      bankAccountCurrency = bankAccount.get('currency').get('abbreviation');
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

      return callback(true);
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
      if (moment(applicationDate).isBefore(minDate)) {
        this.set("applicationDate", minDate);
      }
      if (moment(distributionDate).isAfter(applicationDate)) {
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
    _applyLineBalance: function (receivable, options, step) {
      if (receivable.isDebit() && this.get('balance') === 0) {
        return options.error('_noApplicableCashReceiptBalance'.loc());
      }

      var that = this,
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
                options.error('locked');  // TODO proper error msg
              }
              else {
                options.success(model);
              }
            },
            error: options.error
          });
        }
      };

      return plan[step || 'checkCurrency']();
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
         * @callback
         * Apply line balance once preconditions are met
         */
        success: function (receivable) {
          var terms = receivable.get('terms'),
            application = _.extend(
              this._calculateReceivableApplication(receivable), {
              receivable: receivable
            }),
            line = new XM.CashReceiptLine(application),
            pending = new XM.CashReceiptLinePending(application);

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

        /**
         * As opposed to the discount percentage rate, this is the calculated
         * quantum of discount which is to be subtracted from the amount.
         */
        discountAmount = XT.math.round(payoff ?
          balance * discount :
          value / (1 - discount),
        XT.MONEY_SCALE),

        /**
         * Amount to be applied to the receivable
         */
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
  }, _.invert(XM.FundsTypeEnum));

  /**
   * @class XM.CashReceiptLine
   * @extends XM.Model
   */
  XM.CashReceiptLine = XM.Document.extend({
    recordType: 'XM.CashReceiptLine',
    //idAttribute: 'uuid',
    enforceUpperKey: false,
    numberPolicy: XM.Document.AUTO_NUMBER,
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
    //idAttribute: 'uuid',
    readOnly: true
  });

  /**
   * @class XM.CashReceiptReceivable
   * @extends XM.Model
   * @mixes XM.ReceivableMixin
   */
  XM.CashReceiptReceivable = XM.Receivable.extend({
    // mixins: [ XM.ReceivableMixin ],
    recordType: 'XM.CashReceiptReceivable',
    idAttribute: 'uuid',
    readOnly: true,

    readOnlyAttributes: [
      'receivable.documentNumber',
      'receivable.documentType',
      'receivable.orderNumber',
      'receivable.dueDate',
      'receivable.currency',
      'balance',
      'allPending'
    ],

    initialize: function () {
      if (this.isNew()) {
        this.setReadOnly(this.readOnlyAttributes, false);
      }
    },

    events: {
      'change:amount' : 'updateBalance',
      'change:appliedAmount': 'updateBalance'
    },

    updateBalance: function () {
      this.set({ balance: this.get('amount') - this.get('appliedAmount') });
    }
  });
  XM.CashReceiptReceivable = XM.CashReceiptReceivable.extend(XM.ReceivableMixin);

  /**
   * @class XM.CashReceiptListItem
   * @extends XM.Info
   * @see XM.CashReceipt
   */
  XM.CashReceiptListItem = XM.Info.extend({
    recordType: 'XM.CashReceiptListItem',
    editableModel: 'XM.CashReceipt',
    idAttribute: 'number',

    canPost: function (callback) {
      callback(XT.session.privileges.get("MaintainCashReceipts"));
    },
    canVoid: function (callback) {
      callback(!this.get('isPosted') || XT.session.privileges.get("VoidPostedCashReceipts"));
    }
  });

  /**
   * @class XM.CashReceiptLineListItem
   * @extends XM.Info
   * @see XM.CashReceipt
   */
  XM.CashReceiptLineListItem = XM.Info.extend({
    recordType: 'XM.CashReceiptLineListItem',
    editableModel: 'XM.CashReceiptLine',
    idAttribute: 'number',
    canPost: function (callback) {
      callback(XT.session.privileges.get("PostCashReceipts"));
    }
  });

  /**
   * @class XM.CashReceiptRelation
   * @extends XM.Info
   */
  XM.CashReceiptRelation = XM.Info.extend({
    recordType: 'XM.CashReceiptRelation',
    editableModel: 'XM.CashReceipt'
  });

  /**
   * @class XM.CashReceiptCollection
   * @extends XM.Collection
   */
  XM.CashReceiptCollection = XM.Collection.extend({
    model: XM.CashReceipt
  });

  /**
   * @class XM.CashReceiptCollection
   * @extends XM.Collection
   */
  XM.CashReceiptRelationCollection = XM.Collection.extend({
    model: XM.CashReceiptRelation
  });

  /**
   * @class XM.CashReceiptLineListItemCollection
   * @extends XM.Collection
   */
  XM.CashReceiptLineListItemCollection = XM.Collection.extend({
    model: XM.CashReceiptLineListItem
  });

  /**
   * @class XM.CashReceiptListItemCollection
   * @extends XM.Collection
   */
  XM.CashReceiptListItemCollection = XM.Collection.extend({
    model: XM.CashReceiptListItem
  });

  /**
   * @class XM.CashReceiptReceivableCollection
   * @extends XM.Collection
   */
  XM.CashReceiptReceivableCollection = XM.Collection.extend({
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
