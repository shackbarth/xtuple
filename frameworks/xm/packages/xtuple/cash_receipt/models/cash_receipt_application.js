// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class
  
  Used to consolidate receivable and cash receipt detail into a single object.

  @extends SC.Object
*/
XM.CashReceiptApplication = SC.Object.extend(XT.Logging,
  /** @scope XM.CashReceiptApplication.prototype */ {
  
  cashReceipt: null,
  
  cashReceiptDetail: null,
  
  receivable: null,
  
  /**
    The amount to be applied in the money of the receivable.
    
    @type XM.Money
  */
  appliedMoney: null,
  
  /** @private */
  appliedMoneyExchangeRate: 1,
  
  /** @private */
  appliedMoneyExchangeRateBinding: SC.Binding.from('*appliedMoney.exchangeRate').oneWay().noDelay(),

  /** @private */
  isLoadingCashReceiptExchangeRate: false,
  
  /** @private */
  isLoadingCashReceiptExchangeRateBinding: SC.Binding.from('*cashReceipt.appliedMoney.isLoading').oneWay().noDelay(),
  
  /** @private */
  isLoadingReceivableExchangeRate: false,
  
  /** @private */
  isLoadingReceivableExchangeRateBinding: SC.Binding.from('*appliedMoney.isLoading').oneWay().noDelay(),
  
  /** 
    The value of all pending applications in the receivable's currency.
  */
  pending: 0,
  
  /** @private */
  pendingBinding: SC.Binding.from('*receivable.pending').oneWay().noDelay(),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    The amount to be applied in the currency of the cash receipt.
    
    @type Number
  */
  applied: function() {
    return this.getPath('cashReceiptDetail.amount') || 0;
  }.property('cashReceiptDetail').cacheable(),

  /**
    The discount to be applied in the currency of the cash receipt.
    
    @type Number
  */
  discount: function() {
    return this.getPath('cashReceiptDetail.discount') || 0;
  }.property('cashReceiptDetail').cacheable(),
  
  /**
    The balance due on the receivable in the receivable's currency including pending
    applications.
    
    @type Number
  */  
  balance: function() {
    var receivable = this.get('receivable'),
        balance = receivable.get('balance'),
        pending = receivable.get('pending');
    return SC.Math.round(balance - pending, XT.MONEY_SCALE);
  }.property('pending'),
  
  // .................................................
  // METHODS
  //
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.set('appliedMoney', XM.Money.create()); // bindings set up by observers
    this.set('appliedMoney', XM.Money.create());
  },
  
  /**
    Apply an amount from the cash receipt associated with this application
    to the receivable associtated with this application.
    
    @param {Number} amount
    @param {Number} discount
    @param {Function} callback
  */
  apply: function(amount, discount) {
    if (this.getPath('cashReceipt.isPosted')) return;
    this._xm_pendingAmount = amount;
    this._xm_pendingDiscount = discount;
    this._applyPending();
  },

  /**
    Apply as much as possible of the cash receipt to the balance of the receivable.
    
    @param {Function} optional - callback
  */  
  applyBalance: function(callback) {
    this._xm_applyBalance = true;
    this._xm_pendingCallback = callback;
    this._applyBalancePending();
  },
  
  /**
    Clear this application.
  */
  clear: function() {
    var cashReceipt = this.get('cashReceipt'),
        details = cashReceipt.get('details'),
        detail = this.get('cashReceiptDetail'),
        id = detail.get('id'),
        applied = this.get('applied') * -1,
        discount = this.get('discount') * -1,
        status = detail.get('status'), K = SC.Record;

    // remove related pending application record
    this._xm_removePending();
    
    // remove the detail from this object
    if (detail) {
      if (status == K.READY_NEW) details.removeObject(detail);
      detail.destroy();
      
      // update the cash receipt totals
      cashReceipt.updateApplied(applied);
      cashReceipt.updateDiscount(discount);
    }
    this.set('cashReceiptDetail', null);
  },
  
  /** @private
    Removes the pending application record associated with detail on this object from the receivable.
  */
  _xm_removePending: function() {
    var applications = this.getPath('receivable.pendingApplications'),
        id = this.getPath('cashReceiptDetail.id'), pending;
    pending = applications.findProperty('id', id);
    if (pending) {
      // just remove, don't destroy because we might reintroduce later
      applications.removeObject(pending);
    }
  },

  /** @private 
    Creates a pending application record on the receivable so we get a correct total for "all pending" 
    applications.
    
    @param {Number} total amount applied
  */
  _xm_createPending: function(amount) {
    var cashReceipt = this.get('cashReceipt'),
        crCurrency = cashReceipt.getPath('currency'),
        applicationDate = cashReceipt.get('applicationDate'),
        distributionDate = cashReceipt.get('distributionDate'),
        store = cashReceipt.get('store'),
        detail = this.get('cashReceiptDetail'),
        receivable = this.get('receivable'),
        applications = receivable.get('pendingApplications'),
        arCurrency = receivable.get('currency'),
        storeKey, pending,
        recordType = XM.ReceivablePendingApplication;
 
    // bail if nothing to do
    if (!detail) return;
    
    this.log('Creating pending application');
    
    // make sure we have some kind of valid application date
    applicationDate = applicationDate ? applicationDate : (distributionDate ? distributionDate : SC.DateTime.create());

    // create a pending application record (info only, the datasource will ignore this)
    storeKey = store.loadRecord(recordType, {
      guid: detail.get('id'),
      pendingApplicationType: recordType.CASH_RECEIPT,
      receivable: receivable,
      amount: result
    });
    pending = store.materializeRecord(storeKey);
      
    // bind the ids of detail (which may have a temporory id at this time)
    // we may need to reference this later if this application gets cleared
    SC.Binding.from('id', detail).to('id', pending).oneWay().noDelay().connect();
      
    // push new pending record into pending applications array
    applications.pushObject(pending);
  },
  
  // .................................................
  // OBSERVERS
  //
  
  appliedDidChange: function() {
    if (this.get('isLoadingReceivableExchangeRate') ||
        this.get('isLoadingCashReceiptExchangeRate')) return;
    var crCurrencyRate = this.getPath('cashReceipt.appliedMoney.exchangeRate'),
        arCurrencyRate = this.getPath('appliedMoney.exchangeRate'),
        crApplied = this.get('applied'),
        arApplied = SC.Math.round(crApplied * arCurrencyRate / crCurrencyRate, XT.MONEY_SCALE);
        
    // update applied money
    this.setPathIfChanged('appliedMoney.localValue', arApplied);
    
    // rebuild pending application records
    var amount = this.get('applied') + this.get('discount');
    this._xm_removePending();
    this._xm_createPending(amount);
  }.observes('applied', 'appliedMoneyExchangeRate', 'isLoadingReceivableExchangeRate', 'isLoadingCashReceiptExchangeRate'),
  
  cashReceiptDidChange: function() {
    var cashReceipt = this.get('cashReceipt'),
        appliedMoney = this.get('appliedMoney');
    SC.Binding.from('applicationDate', cashReceipt)
          .to('effective', appliedMoney)
          .oneWay().noDelay().connect();
  }.observes('cashReceipt'),
 
  receivableDidChange: function() {
    var currency = this.getPath('receivable.currency'),
        appliedMoney = this.get('appliedMoney');
    appliedMoney.set('currency', currency);
  }.observes('receivable'),
  
  /** @private
    Execute any pending request to apply cash. If the client is waiting
    for exchange rate data, punt and try again when loading is complete.
  */
  _applyPending: function() {
    // bail if nothing to do
    if (SC.none(this._xm_amountPending)) return;
    
    // can't process if exchange rates are still loading
    if (this.get('isLoadingCashReceiptExchangeRate') ||
        this.get('isLoadingReceivableExchangeRate')) {
      this.log('Exiting apply pending until exchange rates loaded.');
      return;
    }
    
    // setup
    var cashReceipt = this.get('cashReceipt'),
        crCurrencyRate = cashReceipt.get('appliedMoney.exchangeRate'),
        arCurrencyRate = this.get('appliedMoney.exchangeRate'),
        detail = this.get('cashReceiptDetail'),
        receivable = this.get('receivable'),
        documentType = receivable.get('documentType'),
        applied = this.get('applied'),
        balance = this.get('balance'),
        store = receivable.get('store'),
        discount = this._xm_discountPending || 0,
        amount = this._xm_amountPending;
        
    // calculate balance in cash receipt currency
    balance = SC.Math.round(balance * crCurrencyRate / arCurrencyRate + applied, XT.MONEY_SCALE);
  
    // values must be valid
    if (amount < 0 || discount < 0 || 
        amount + discount > balance ||
        isPosted) {
      this.error('Can not apply a value greater than balance');
      return false;
    }
  
    // credits need sense reversed
    if (documentType === XM.Receivable.CREDIT_MEMO || 
        documentType === XM.Receivable.CUSTOMER_DEPOSIT) {
      amount = amount * -1;
      discount = 0; // should never be a discount on credit
    }
  
    // clear the old detail
    if (detail) this.clear();
    
    // create a new detail
    detail = store.createRecord(XM.CashReceiptDetail, {});
    detail.set('receivable', receivable)
          .set('amount', amount)
          .set('discount', discount);
    cashReceipt.get('details').pushObject(detail);
              
    // associate detail to this application
    this.set('cashReceiptDetail', detail);

    // notify caller if applicable
    if (this._xm_callbackPending) this._xm_callbackPending.call(detail);
    
    // reset
    this._xm_amountPending = undefined;
    this._xm_discountPending = undefined;
    this._xm_callbackPending = undefined;
  }.observes('isLoadingReceivableExchangeRate', 'isLoadingCashReceiptExchangeRate'),

  /** @private
    Execute any pending request to apply cash balance. If the client is waiting
    for exchange rate data, punt and try again when loading is complete.
  */
  _applyBalancePending: function() {
    // bail if nothing to do
    if (!this._xm_applyBalance) return;
    
    // can't process if exchange rates are still loading
    if (this.get('isLoadingCashReceiptExchangeRate') ||
        this.get('isLoadingReceivableExchangeRate')) {
      this.log('Exiting apply pending until exchange rates loaded.');
      return;
    }
      
    var applied = this.get('applied'),
        cashReceipt = this.get('cashReceipt'),
        crBalance = cashReceipt.get('balance'),
        crCurrencyRate = cashReceipt.get('appliedMoney.exchangeRate'),
        arCurrencyRate = this.get('appliedMoney.exchangeRate'),
        receivable = this.get('receivable'),
        documentType = receivable.get('documentType'),
        arBalance = this.get('balance'),
        documentDate = receivable.get('documentDate'),
        terms = receivable.get('terms'),
        discountDate = terms ? terms.calculateDiscountDate(documentDate) : null,
        discountPercent = terms ? terms.get('discountPercent') / 100 : 0,
        discount = 0, amount;

    // determine balance we could apply in cash receipt currency
    amount = SC.Math.round(crBalance + applied, XT.MONEY_SCALE);
    balance = SC.Math.round(arBalance * crCurrencyRate / arCurrencyRate + applied, XT.MONEY_SCALE);
        
    // bail out if nothing to do
    if (balance === 0 || amount === 0) return;
    
    // calculate discount if applicable
    if (balance > 0 && discountDate && 
        SC.DateTime.compareDate(documentDate, discountDate) <= 0) {
      discount = SC.Math.round(balance * discountPercent, XT.MONEY_SCALE);
    }
    
    // adjust the amount or discount as appropriate and apply
    if (documentType === XM.Receivable.INVOICE || 
        documentType === XM.Receivable.DEBIT_MEMO) {
      if (arBalance <= amount + discount) {
        amount = SC.Math.round(arBalance - discount, XT.MONEY_SCALE);
      } else {
        discount = SC.Math.round((amount / (1 - discountPercent)) - amount, XT.MONEY_SCALE);
      }
    } else {
      amount = arBalance;
      discount = 0;
    }
    if (amount) return this.apply(amount, discount);
    
    this._xm_applyBalance = false;
  }.observes('isLoadingReceivableExchangeRate', 'isLoadingCashReceiptExchangeRate'),
  
});

