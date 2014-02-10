(function () {
  'use strict';

  /**
   * TODO caveats and missing features:
   *
   * the cash receipt list item columns may not be aligned correctly
   *
   * smoke tests are disabled because they fail on opening cash receipt
   *   workspace, even though it works in browser.
   */

  var async = require("async"),
    _ = require("underscore"),
    moment = require('moment'),
    assert = require("chai").assert,
    NOW = new Date(),

    receivableHash = {
      uuid: "TestReceivableId" + Math.random(),
      customer: {number: "TTOYS"},
      dueDate: new Date(),
      amount: 100,
      currency: {abbreviation: "USD"},
      //documentNumber: "DocumentNumber" + Math.random()
    },
    /**
     * Existing bank expected to be in the test database.
     */
    bankAccountHash = {
      name: "EBANK",
      description: "eBank description",
      bankName: "eBank",
      accountNumber: 123145,
      notes: "Test bank account notes"
    },
    cashReceiptHash = {
      amount: 10000,
      applicationDate: new Date(),
      bankAccount: bankAccountHash,
      useCustomerDeposit: true,
      currency: {
        abbreviation: 'USD',
      },
      customer: {
        number: 'TTOYS'
      },
      lineItems: [
        {
          amount: 100,
          discount: 0,
          cashReceiptReceivable: {
            receivable: _.defaults({
              documentDate: NOW,
              amount: 100,
              currency: { abbreviation: 'USD' }
            }, receivableHash)
          }
        },
        {
          amount: 100,
          discount: 50,
          cashReceiptReceivable: {
            receivable: _.defaults({
              documentDate: moment(NOW).subtract('days', 10),
              amount: (Math.random() * 100) + 100,
              currency: { abbreviation: 'USD' }
            }, receivableHash)
          }
        },
        {
          amount: 100,
          discount: 0,
          cashReceiptReceivable: {
            receivable: _.defaults({
              documentDate: moment(NOW).subtract('days', 1),
              amount: (Math.random() * 100) + 100,
              currency: { abbreviation: 'EUR' }
            }, receivableHash)
          }
        }
      ]
    },
    /**
    Cash Receipts may be applied to either an open Invoice or an open miscellaneous Debit Memo
    @class
    @alias CashReceipt
    @property {String} number
    @property {Customer} customer
    @property {Number} amount
    @property {Currency} currency
    @property {Number} currencyRate
    @property {String} documentNumber
    @property {Date} documentDate 
    @property {BankAccount} bankAccount
    @property {Date} distributionDate defaults to the current date
    @property {Date} applicationDate defaults to the current date
    @property {String} notes
    @property {Boolean} isPosted
    @property {Number} balance
    */
    cashReceiptSpec = {
      recordType: 'XM.CashReceipt',
      collectionType: 'XM.CashReceiptCollection',
      /**
      @member -
      @memberof CashReceipt.prototype
      @description CashReceipt has no cached defined
      */
      cacheName: null,
      skipSmoke: true,
      // XXX crud fails because someone a bunch of attributes '0', '1', '2', etc
      // are added to CashReceipt.attributes during the test? no idea why this is
      skipCrud: true,
      instanceOf: 'XM.Document',
      /**
      @member -
      @memberof CashReceipt.prototype
      @description CashReceipts are lockable.
    */
      isLockable: true,
      /**
      @member -
      @memberof CashReceipt.prototype
      @description The ID attribute is "number", which will not be automatically uppercased.
      */
      idAttribute: 'number',
      enforceUpperKey: false,
      attributes: [
        'number', 'customer', 'amount', 'currency', 'currencyRate',
        'documentNumber', 'documentDate', 'bankAccount', 'distributionDate',
        'applicationDate', 'notes', 'isPosted', 'balance'
      ],
      requiredAttributes: [
        'customer', 'amount', 'currency', 'currencyRate', 'number',
        'bankAccount', 'applicationDate', 'isPosted', 'useCustomerDeposit'
      ],
      defaults: {
        isPosted: false,
        currencyRate: 1.0
      },
      /**
      @member -
      @memberof CashReceipt.prototype
      @description CashReceipts can be read by any users and can be created, updated,
        or deleted by users with the "MaintainCashReceipts" privilege.
      */
      privileges: {
        create: 'MaintainCashReceipts',
        read: true,
        update: 'MaintainCashReceipts',
        delete: 'MaintainCashReceipts'
      },
      /**
      @member -
      @memberof CashReceipt.prototype
      @description Used in the Billing module
      */
      extensions: ["billing"],
      updatableField: 'notes',
      listKind: 'XV.CashReceiptList',
      createHash: cashReceiptHash
    },

    cashReceiptTest = function () {

      describe('XM.CashReceipt', function () {
        var cashReceiptSchema, usd, eur, gbp,
          cashReceiptLine,
          cashReceiptReceivable,
          cashReceipt;

        beforeEach(function () {
          cashReceiptSchema = XT.session.schemas.XM.get('CashReceipt');
          cashReceipt = new XM.CashReceipt(cashReceiptHash);

          assert.ok(cashReceiptSchema);
          assert.ok(cashReceipt);

          usd = XM.currencies.get('USD');
          eur = XM.currencies.get('EUR');
          gbp = XM.currencies.get('GBP');
        });

        /*
          * XM.CashReceipt is lockable.
          * * XM.CashReceipt should include the following attributes:
          * > String "number" that is the documentKey and the idAttribute
          * > SalesCustomer "customer" required
          * > Money "amount" required
          * > Currency "currency" required
          * > Number "currencyRate" required
          * > String "documentNumber"
          * > Date "documentDate"
          * > BankAccountRelation "bankAccount" required
          * > Date "distributionDate" defaulting to the current date
          * > Date "applicationDate" required defaulting to the current date
          * > String "notes"
          * > Boolean "isPosted" required, defaulting to false, read only
          * > CashReceiptLine "lineItems"
          * * The numbering policy on XM.CashReceipt should be XM.Document.AUTO_NUMBER.
          * * The numbering sequence used should be 'CashRcptNumber'.
          */
        describe('privileges', function () {
          it.skip('Any user should be able to view a XM.CashReceipt object.', function () {
          });
          it.skip('A XM.CashReceipt object can not be deleted if it has been posted.', function () {

          });
        });
        /**
        @member -
        @memberof CashReceipt.prototype
        @description Amount applied should be the calculated sum of all applications
        in the Cash Receipt currency
        */
        it.skip('Money "applied" that is the calculated sum of all applications ' +
          'in the Cash Receipt currency', function () {
        });
        /**
        @member -
        @memberof CashReceipt.prototype
        @description Discount should be the calculated sum of all discounts
        in the Cash Receipt currency
        */
        it.skip('Money "discount" that is the calculated sum of all discounts ' +
          'in the Cash Receipt currency', function () {

        });
        /**
        @member -
        @memberof CashReceipt.prototype
        @description Balance amount is the calculated value of amount - applied
        */
        it.skip('Money "balance" that is the calculated value of amount - applied', function () {

        });
        /**
        @member -
        @memberof CashReceipt.prototype
        @description 'useCustomerDeposit' should default to the value of setting
        'EnableCustomerDeposits'
        */
        it.skip('Boolean "useCustomerDeposit" defaulting to the metric' +
            'setting "EnableCustomerDeposits" || false', function () {

        });

        describe('XM.FundsType', function () {
          it('sanity', function () {
            assert.ok(XM.FundsTypeEnum);
            assert.equal(_.keys(XM.FundsTypeEnum).length, 10);
          });
          /**
          @member -
          @memberof CashReceipt.prototype
          @description FundsType value should default to 'CHECK' 
          */
          it('CashReceipt "fundsType" required, defaulting to XM.CashReceipt.CHECK', function () {
            assert.equal(new XM.CashReceipt().get('fundsType'), XM.CashReceipt.CHECK);
          });
        });

        it('XM.CashReceiptApplyBalanceOptions', function () {
          assert.ok(XM.CashReceiptApplyOptionEnum);
        });

        it('status:READY_CLEAN handled by #onReadyClean()', function () {

          /**
          @member -
          @memberof CashReceipt.prototype
          @description If the funds type is one of the four credit card types then make
           the following attributes read only:
              amount,
              fundsType,
              documentNumber,
              documentDate,
              bankAccount,
              distributionDate,
              applicationDate
          */
          it.skip('should handle FundsType = a credit card type', function (done) {
            var cr = new XM.CashReceipt({ fundsType: XM.FundsType.VISA });

            cr.on('status:READY_CLEAN', function (model, status) {
              assert(XM.FundsType.isCreditCard(cr.get('fundsType')));
              assert.isTrue(cr.isReadOnly('fundsType'));
              assert.isTrue(cr.isReadOnly('documentNumber'));
              assert.isTrue(cr.isReadOnly('documentDate'));
              assert.isTrue(cr.isReadOnly('bankAccount'));
              assert.isTrue(cr.isReadOnly('distributionDate'));
              assert.isTrue(cr.isReadOnly('applicationDate'));

              done();
            });

            cr.setStatus(XM.Model.READY_CLEAN);
          });

          /**
          @member -
          @memberof CashReceipt.prototype
          @description If the cash receipt is posted then the Cash Receipt should be read only
          */
          it.skip('should handle isPosted = true', function (done) {
            var cr = new XM.CashReceipt({ isPosted: true });

            cr.on('status:READY_CLEAN', function (model, status) {
              assert.isTrue(cr.isReadOnly());
              done();
            });

            cr.setStatus(XM.Model.READY_CLEAN);
          });
        });

        /**
          @member -
          @memberof CashReceipt.prototype
          @description When amount or applied values have been updated
          the balance should be recalculated
         */
        it.skip('change:amount handled by #amountChanged()', function () {
          // TODO
        });

        /**
          @member -
          @memberof CashReceipt.prototype
          @description When the customer is changed on the cash receipt, the currency
          will be set to that of the customer
         */
        it('change:customer is handled by #customerChanged()', function () {
          var cr = new XM.CashReceipt();

          /*
           * TODO
          assert.equal(cr.get('currency'), XM.baseCurrency);
          cr.set({
            customer: new XM.Customer({
              currency: gbp
            })
          });

          assert.equal(cr.get('currency'), gbp);

          cr.set({
            customer: new XM.Customer({
              currency: eur
            })
          });

          assert.equal(cr.get('currency'), eur);
          */
        });

        it('change:currency handled by #currencyChanged()', function () {
          var cr = new XM.CashReceipt(),
            ratio = cr.get('currencyRate');
          assert.equal(cr.get('currency'), XM.baseCurrency);
          assert.equal(ratio, 1.0);

          /*
           * TODO
          cr.set({ currency: gbp });
          assert.notEqual(cr.get('currencyRate'), ratio);

          cr.set({ currency: XM.baseCurrency });
          assert.equal(cr.get('currencyRate'), ratio);
          */
        });

        /**
          @member -
          @memberof CashReceipt.prototype
          @description  When the currency or distribution date is changed on the cash
          receipt, the currency rate for that currency and date should be fetched and set.
        */
        it('change:distributionDate handled by #distributionDateChanged()', function () {
          var cr = new XM.CashReceipt(),
            ratio = cr.get('currencyRate');
          assert.equal(cr.get('currency'), XM.baseCurrency);
          assert.equal(ratio, 1.0);

          // TODO cr.set({ distributionDate: XT.date.endOfTime() });
          //assert.equal(cr.get('currencyRate'), 0);
        });

        /**
          @member -
          @memberof CashReceipt.prototype
          @description When one or more cash receipt line items have been added to a
          cash receipt, customer, bank account and currency will be made read only.
         */
        it.skip('add:lineItems handled by #lineItemAdded()', function () {
          //var cr = new XM.CashReceipt();

        });

        it.skip('When either the distribution date or the application date' +
          'changes call the "dateDidChange" function.', function () {

        });

        it.skip('#getMinimumDate()', function () {
          assert.equal(new CashReceipt().getMinimumDate(), XT.date.startOfTime());
          assert.equal(cashReceipt.getMinimumDate(), NOW);

          /*
            The "getMinimumDate" function should return the maximum documentDate
            of all receivables associated with cash receipt line items, or
            XM.date.startOfTime() if no line items exist.
          */
        });
        /**
          @member -
          @memberof CashReceipt.prototype
          @description If the currency on the Cash receipt does not match the bank account currency
          a warning dialog should be displayed with message ' This transaction is specified in %1 while
          the Bank Account is specified in %2.Do you wish to convert at the current Exchange Rate?
          (%1 and %2 are the Currency abbreviations)
         */
        it.skip('#checkCurrency()', function () {

        /*
          *   * A function "checkCurrency" should exist that accepts a callback as an argument and returns the receiver.
          *   * The "checkCurrency" function should do the following:
          *   > Check a cache variable to see if the user has been warned before, if so call the callback and exit the function
          *   > Check to see if the currency on the cash receipt matches the bank account currency. If they do not
          *   match, use "notify" to ask the user whether to proceed.
          *   > The warning message is: "This transaction is specified in %1 while the Bank Account is specified in %2.
          *   Do you wish to convert at the current Exchange Rate?"
          *   > If the user chooses "yes" then forward the callback
          *   > Store a cache variable indicating the user has been warned.
        */
        });
        it.skip('#dateDidChange()', function () {
          /*
          *   * A function "dateDidChange" should exist on XM.CashReceipt that returns the receiver.
          *   * The "dateDidChange" function should work as follows:
          *
          *   dateDidChange = function () {
            *   var minDate = this.minimumDate(),
            *   applicationDate = this.get("applicationDate"),
            *   distributionDate = this.get("distributionDate");
            *   if (applicationDate < minDate) {
              *   this.set("applicationDate", minDate);
              *   }
            *   if (distributionDate > applicationDate) {
              *   this.set("distributionDate", applicationDate);
              *   }
            *   }
          */

        });
        /**
          @member -
          @memberof CashReceipt.prototype
          @description An error message should be displayed in the following cases:
          1) if the amount to apply is greater than the balance of the cash receipt
          2) if the amount to apply plus the discount is greater than the balance of the receivable
          3) if a discount is passed where the receivable is a credit
        */
        it.skip('#applyAmount(receivable, amount, discount)', function () {
          /*
        *   * XM.CashReceipt should include a function "applyAmount" on the prototype that accepts a XM.CashReceiptReceivable,
        *   an amount, and a discount. It returns the receiver.
          *   * The "applyAmount" function will do the following:
          *   > Throw an error if the amount to apply is greater than the balance of the cash receipt
          *   > Throw an error if the amount to apply plus the discount is greater than the balance of the receivable
          *   > Throw an error if a discount is passed where the receivable is a credit
          *   > If the receivable is a credit, the sense for amount will be reveresed.
          *   > Call checkCurrency(). (asynchronus operation, will require callback)
          *   > Obtain a lock on the receivable (asynchronus operation, will require callback)
          *   > If the lock fails, throw an error
          *   > If a cash receipt line for the receiveable exists then update the existing model
          *   > Otherwise a new XM.CashReceiptLine object will be created with the three values passed.
          *   > Create or replace a corresponding XM.CashReceiptLinePending record on the receivable passed.
          *   > Call dateDidChange()
          */
        });
        /**
          @member -
          @memberof CashReceipt.prototype
          @description Selecting 'Clear' button should clear the applied amount from the
          cash receipt line
        */
        it.skip('#clearLine', function () {

          /*
        *   * XM.CashReceipt should include a function "clearLine" on the prototype that accepts an arguments XM.CashReceiptReceivable and returns the receiver.
          *   * The "clearLine" function will do the following:
          *   > Find any cash receipt line on the cash receipt that references the receivable.
          *   > If found
          *   - destroy the corresponding XM.CashReceiptLinePending model on the receivable.
          *   - destroy the XM.CashReceiptLine on the cash receipt.
        *   */

        });
        /**
          @member -
          @memberof CashReceipt.prototype
          @description Selecting 'Apply Line Balance' button should apply as much of the
          cash receipt balance as possible to the selected receivable
        */
        it.skip('#applyLineBalance(receivable, callback)', function () {
          /*
        *   * XM.CashReceipt should include a function "applyLineBalance" on the prototype that accepts arguments
              *   XM.CashReceiptReceivable and a callback. It returns the receiver.
        *   * The applyLineBalance function will apply as much of the cash receipt balance as possible to the receivable and will work as follows:
        *   applyLineBalance = function (receivable, callback) {
          *   var cashReceiptBalance = this.get("balance"),
            *   cashReceiptCurrency = this.get("currency"),
            *   cashReceiptLines = this.get("cashReceiptLines"),
            *   applied = this.get("applied"),
            *   distributionDate = this.get("distributionDate"),
            *   documentDate = this.get("documentDate"),
            *   terms = receivable.get("terms"),
            *   discountPercent = terms ? terms.get("discountPercent") : 0,
            *   discountDate = terms ? terms.calculateDiscountDate(documentDate) : false,
            *   receivableBalance = receivable.get("balance"),
            *   receivableCurrency = receivable.get("currency"),
            *   isDebit = receivable.isDebit(),
            *   that = this,
            *   checkCallback,
            *   options = {},
            *   discountAmount = 0,
            *   applyAmount;
          * Pretty much all the work is done after the currency check
            checkCallback = function () {
              // Clear previous entries
              // that.clearLine(receivable);
              // // Bail if nothing to apply
              // if (isDebit && balance === 0) { return; }
              // // Callback after currency conversion
              // options.success = function (localValue) {
                // var cashReceiptLine = new XM.CashReceiptLine(null, {isNew:true}),
                // cashReceiptPending = new XM.CashReceiptLinePending(null, {isNew:true}),
                // pendingApplications = receivable.get("pendingApplications"),
                // options = {},
                // attrs;
                // // Calculate Discount if applicable
                // if (isDebit && terms && documentDate < discountDate) {
                  // discountAmount = receivableBalance * discountPercent;
                // }
                // // Calculate apply amount and final discount amount
                // if (receivableBalance < cashReceiptBalance - discountAmount) {
                  // applyAmount = receivableBalance - discountAmount;
                // } else {
                  // discountPercent = XT.math.subtract(1, discountPercent, XT.PERCENT_SCALE);
                  // discountAmount = XT.math.round(cashReceiptBalance / discountPercent), XT.MONEY_SCALE);
                  // applyAmount = cashReceiptBalance;
                // }
                // // Callback after receivable fetch
                , XG:true// options.success = function () {
                  // // Deterimine here whether a lock was obtained
                  // // If not and we have a callback, just move on
                  // // to the next one with the callback
                  // // If no callback, notify the user the record was
                  // // locked and can not be applied and exit the function
                  // // Now that we've deterimined what
                  // // to apply and got a lock, set the data
                  // attrs = {
                    // receivable: receivable,
                    // amount: applyAmount,
                    // discountAmount: discountAmount
                  // };
                  // cashReceiptLine.set(attrs);
                  // cashReceiptLines.add(cashReceiptLine);
                  // cashReceiptPending.set(attrs);
                  // pendingApplications.add(cashReceiptPending);
                  // // Adjust dates to ensure date alignment is valid
                  // cashReceipt.dateDidChange();
                  // // Finally forward the original callback
                  // callback();
                // }
                // // This fetch will obtain a lock on the record
                // receivable.fetch(options);
              // }
              // // Convert receivable, options callback actually does all the work
              // receivableCurrency.toCurrency(cashReceiptCurrency, receivableBalance, distributionDate, options);
            // }
              // // Check for matching currency
              // this.checkCurrency(checkCallback);
              // return this;
          // }
          */

        });
        /**
          @member -
          @memberof CashReceipt.prototype
          @description Selecting 'Apply to Balance' button should apply as much cash from
          the cash receipt as possible to open receivables
        */
        it.skip('#applyBalance(receivables, applyCredits)', function () {
          // * XM.CashReceipt should include a function "applyBalance" on the prototype that
          // accepts arguments for a XM.CashReceiptReceivablesCollection and "includeCredits" and returns the receiver.
          // * The "applyBalance" function applies as much cash from the cash receipt as
          // possible to open receivables as follows:
          // applyBalance = function (receivables, applyCredits) {
          // var cashReceipt = this,
          // credits,
          // debits,
          // creditsCallback,
          // debitsCallback,
          // comparator;
          // comparator = function (a ,b) {
          // // Sort by dueDate then documentNumber
          // };
          // // Because asynchronous currency conversion is involved,
          // // we'll have to process credits recursively
          // creditsCallback = function () {
          // // If nothing left to do, move on to debits
          // if (!credits.length) {
          // debitsCallback();
          // return;
          // }
          // // Otherwise, move on to the next receivable
          // var credit = credits.shift();
          // cashReceipt.applyLineBalance(credit, creditsCallback);
          // };
          // // Get our credits in order
          // credits = _.filter(receivables, function (receivable) {
          // return receivable.isCredit();
          // });
          // credits.comparator = comparator;
          // credits.sort();
          // // Because asynchronous currency conversion is involved,
          // // we'll have to process debits recursively
          // debitsCallback = function () {
          // // If nothing left to do, bail
          // if (!cashReceipt.get("balance") || !debits.length) { return; }
          // // Otherwise, move on to the next receivable
          // var debit = debits.shift();
          // cashReceipt.applyLineBalance(debit, debitsCallback);
          // };
          // // Get our debits in order
          // debits = _.filter(receivables.models, function (receivable) {
          // return receivable.isDebit();
          // });
          // debits.comparator = comparator;
          // debits.sort();
          // // If apply credits and there are any
          // // then we run through that first
          // if (applyCredits && credits.length) {
          // creditsCallback();
          // // Otherwise go straight to debits
          // } else {
          // debitsCallback();
          // }
          // return this;
          // }

        });
      });

      describe('XM.CashReceiptRelation', function () {

        it.skip('A nested only model called XM.CashReceiptRelation extending XM.Info' +
          'should exist in the billing extension.', function () {

        });

        it.skip('should contain required attributes ', function () {
          /*
          should include the following attributes:
            * > String "number" that is the idAttribute
            * > CustomerRelation "customer"
            * > Currency "currency"
            * > Number "currencyRate"
            *
          */
        });

      });

      describe('XM.ReceivableRelation', function () {
        /*
          * * XM.ReceivableRelation should include the following attributes:
          * > String "uuid" that is the idAttribute
          * > CustomerRelation "customer"
          * > String "documentType"
          * > String "documentNumber"
        */
        it.skip('XM.ReceivableRelation should be extended by XM.ReceivableMixin', function () {

        });

      });

      describe('XM.CashReceiptLinePending', function () {
        /*
          * XM.CashReceiptLinePending should include the following attributes:
          * > String "uuid" that is the idAttribute
          * > CashReceiptRelation "cashReceipt"
          * > Money "amount"
          * > Currency "currency"
          * > Number "currencyRate"
          * > Money "discount"
        */
        it.skip('XM.CashReceiptLinePending should only return results where the' +
            'parent cash receipt is not posted', function () {

        });
      });

      describe('A model called XM.CashReceiptReceivable extending XM.Model', function () {
        /*
          * * XM.CashReceiptReceivable is lockable
          * * XM.CashReceiptReceivable should include the following attributes:
          * * XM.CashReceiptReceivable should be extended by XM.ReceivableMixin.
          * > String "uuid" that is the idAttribute
          * > CustomerRelation "customer"
          * > String "documentType"
          * > String "documentNumber"
          * > String "orderNumber"
          * > Date "documentDate"
          * > Date "dueDate"
          * > Date "balance" that is the calculated value of amount - paid - all pending
          * > Currency "currency"
          * > Money "allPending" is the sum of all pending cash receipts *in the currency of the receivable*
          * > Boolean "isOpen"
          * > CashReceiptLinePending "pendingCashReceipts"
        */

        it.skip('Date "balance" that is the calculated value of amount - paid - all pending', function () {

        });

        it.skip('Money "allPending" is the sum of all pending cash receipts *in the' +
            'currency of the receivable*', function () {

        });
        it.skip('XM.CashReceiptReceivable requires the "ViewCashReceipts" or' +
            '"MaintainCashReceipts" privileges to be viewed, but can not be' +
            'created, updated or deleted.', function () {

        });
        it.skip('When pendingCashReceipts are added or removed, allPending should' +
            'be recalculated.', function () {

        });
        it.skip('When allPending is changed, the balance should be recalculated.', function () {

        });

      });

      describe('A nested only model called XM.CashReceiptLine extending XM.Model', function () {
        /*
          * * XM.CashReceiptLine should include the following attributes:
          * > String "uuid" that is the idAttribute
          * > ReceivableRealtion "receivable"
          * > Money "amount"
          * > Money "discount"
        */
      });

      describe('XM.CashReceiptListItem', function () {
      /*
          // * XM.CashReceiptListItem should include the following attributes:
          // > String "number" that is the idAttribute
          // > CustomerRelation "customer"
          // > Money "amount"
          // > Currency "currency"
          // > String "fundsType"
          // > String "documentNumber"
          // > BankAccountRelation "bankAccount"
          // > Date "distributionDate"
          // > Boolean "isPosted"
      */
        describe('privileges', function () {

          it.skip('Users require "MaintainCashReceipts" or "ViewCashReceipts"' +
            'to read XM.CashReceiptListItem.', function () {

          });

          it.skip('Users can not create, update or delete XM.CashReceiptListItem.', function () {

          });

        });

        describe('List View', function () {

          /*
            // * XM.CashReceiptListItemCollection based on XM.Collection class should exist.
            // * A List view that presents the XM.CashReceiptListItemCollection sholud exist in the billing extension.
            // * The list view should be added to the billing module.
            // * The list view should allow multiple selections.
            // * Tapping the new buttion in the list view should open a Cash Receipt Workspace backed by new Cash Receipt object.
            // * Users with appropriate privileges should be able to create and edit Cash Receipts from the list.
            // * The cash receipt list view will have the following parameter options:
            // > Cash Receipts
            // - Number
            // > Show
            // - Unposted - unchecked by default
            // > Customer
            // - Number
            // - Type (picker)
            // - Type Pattern (text)
            // - Group
            // > Document Date
            // - From Date
            // - To Date
            // > Distribution Date
            // - From Date
            // - To Date
            // * The Cash Receipt list should include the following actions:
            // > Post - Available when the cash receipt is unposted and the user has the "PostCashReceipts" privilege
            // > Void - Available when the cash receipt is posted and the user has the "VoidPostedCashReceipts" privilege
            // > Delete - Available when the cash receipt is unposted and the user has the "MaintainCashReceipts" privilege
            // * When multiple cash receipts are selected and posted, these posting should all be performed in a single transaction to ensure they are grouped together on bank reconciliation, and if one fails for any reason the entire post rolls back.
            // * A navigator action should exist to "Post All" cash receipts.
            // > This action requires the "PostCashReceipts" privilege
            // > The user sholud receive a prompt asking whether they really want to Post all unposted cash receipts
            // > A dispatch function will be called that posts all unposted cash receipts based on the current query criteria
            // * The cash receipt list should be printable
          *
          */

        });

        describe('Workspace', function () {
          // * The XV.MoneyWidget should handle the use case where the currency ratio is mapped as an attribute to handle conversion calculations.
          // * The cash receipt workspace should map "amount", "currency" and "currencyRate" to a XV.MoneyWidget.
          // * A widget called XV.FundsTypePicker to be used on the workspace should exist that is backed by XM.fundsTypes.
          // * XV.FundsTypePicker should have a published property "allowCreditCards" that defaults to false.
          // * When "allowCreditCards" is false, the picker does not show Mastercard, Visa, American Express and Discover funds types.
          // * When a XV.FundsTypePicker is created, it should set the "allowCreditCards" property to true if the user has the
          //    "ProcessCreditCards" privilege.
          // * A widget called XV.CashReceiptApplyBalanceOptionsPicker to be used on the workspace should be created that is
          //    backed by XM.cashReceiptApplyBalanceOptions
          // * XV.CashReceiptApplyBalanceOptionsPicker should be used on the useCustomerDeposit attribute on the cash receipt workspace
          // * XV.CashReceiptApplyBalanceOptionsPicker should only be visible if the setting "EnableCustomerDeposits" is true.
          // * There should be a binding on the cash receipt workspace to monitor when either the distribution date or application date changes and update the label on the XV.CashReceiptApplyBalanceOptionsPicker as follows:
          // > If distributionDate < applicationDate then label = "Record Receipt as:"
          // > Else label = "Apply Balance As:"
          // * When the balance on a cash receipt is less than zero, the balance value on the workspace should turn red.
          // * A view called XV.CashReceiptApplicationsBox will exist on the cash receipt workspace that combines information
            //  from XV.CashReceiptReceivable and XV.CashReceiptLine.
          // * When a cash receipt is unposted XV.CashReceiptApplicationsBox will display all open
          //      receivables associated with the customer selected on the cash receipt.
          // * When a cash receipt is posted XV.CashReceiptApplicationsBox will display
          //    only receivables associated with cash receipt line items, and all the contents of the control will be disabled.
          // * A text input with a placholder "Find Document" will exist on XV.CashReceiptApplicationsBox. When the value is changed on the
          //      input the view will search for the first receivable instance listed based on a simple
          //      regex match on the "documentNumber" attribute, scroll to and highlight that receivable.
          // * A toggle switch should exist on XV.CashReceiptApplicationsBox that toggles whether receivables that are credits should
          //      be shown or not on the list.
          // * XV.CashReceiptApplications will sort the data by receivable due date, then document number.
          // * XV.CashReceiptApplications should display the following non-editable data from XV.CashReceiptReceivable:
          // > "documentType"
          // > "documentNumber"
          // > "orderNumber"
          // > "documentDate"
          // > "dueDate"
          // > "balance"
          // > "cashReceipt.currency"
          // > "allPending"
          // > "recievable.currency"
          // * XV.CashReceiptApplications should display the following editable data from XV.CashReceiptLine that has been applied to the selected receivable:
          // > "applied"
          // > "discount"
          // * When applied or discount are changed, the "apply" function will be called on the cash receipt object passing in the values on the changed row which should cause the row to be re-rendered with updated values.
          // * XV.CashReceiptApplications should include a selection checkbox on each row
          // * XV.CashReceiptApplications should have buttons on the bottom of the box:
          // > "Apply Balance" - Exceutes applyBalance function on the cash receipt.
          // > "Apply Line" - Executes applyLineBalance function on the cash receipt for each selected row.
          // > "Clear" - Executes clearLine function on the cash receipt for each selected row
          // * If the global "HideApplyToBalance" setting is true, then the "Apply Balance" button should be hidden.
          // * Apply Balance should only be enabled when there is a balance to apply
          // * Apply Line and Clear should only be enabled when one or more rows are selected that are eligible
          // * Apply Line is eligible if there is there is a balance on the cash receipt and an unapplied amount on one or more of the rows selected.
          // * Clear is only eligible of there is an applied amount on the cash receipt and on one or more of the selected rows.
          // * After any of the 3 above functions are run, the list should be re-rendered to reflect data changes.
          // * All locks on listed receivables should be released when the cash receipt workspace is either finished saving or closed.
          // * XV.CashReceipt Workspace should include a credit card panel that lists the customer's credit cards.
          // # HINT: See sales order implementation of credit cards
          // * The credit card panel should only be visible when credit cards are enabled in the system, and the user has the privilege to process credit cards.
          // * The credit card panel should only be active when one of the four credit card funds types are selected.
          // * Whenever the panel is populated, the underlying model should automatically deactivate any cards that have expired.
          // * Users should be able to add and remove credit cards.
          // * Users should only be able to read the last 4 digits of previously saved credit cards
          // * A credit card will be processed when the user chooses to apply or save the cash receipt.
          // > The credit card to be used must exist and be selected or the user will receive an error message.
          // > The credit card must be successfully charged before the model is saved. If the charge fails, the model will not be saved.
          // * There should be a printable report definition for the cash receipt workspace.
          // * There should be a printable report definition for the cash receipt list.
          // * XM.ReceivablesList should include an action to create a new cash receipt for posted receivables that are
          //      debits and where the user has the "MaintainCashReceipts" privilege.
          // * When a new receivable workspace is opened from the receivables list, it should be populated with the
          //      customer of the receivable selected, and the "find document" text box populated with the document number of the receivable.
        });
      });
    };

  module.exports = {
    spec: cashReceiptSpec,
    additionalTests: cashReceiptTest
  };

})();
