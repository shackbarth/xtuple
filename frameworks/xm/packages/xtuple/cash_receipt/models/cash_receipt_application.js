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
  
  /** @private */
  applicationDate: null,
  
  /** @private */
  applicationDateBinding: SC.Binding.from('*cashReceipt.applicationDate').oneWay().noDelay(),
  
  cashReceiptDetail: null,
  
  receivable: null,
  
  /** 
    The value of all pending applications in the receivable's currency.
  /*
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
    Total value to be applied in the currency of the receivable.
    
    @type Number
  */
  receivableApplied: function() {
    var id = this.getPath('cashReceiptDetail.id'),
        applications = this.getPath('receivable.pendingApplications'),
        applications, applied = 0;
        
    // find this application of the cash receipt in array of pending applications
    if (id) {
      application = applications.findProperty('id', id);
      if (application) applied = application.get('amount');
    }
    return applied;
  }.property('pending').cacheable(),
  
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
  
  /**
    Apply an amount from the cash receipt associated with this application
    to the receivable associtated with this application.
    
    @param {Number} amount
    @param {Number} discount
    returns XM.CashReceiptDetail
  */
  apply: function(amount, discount) {
    var cashReceipt = this.get('cashReceipt'),
        crCurrency = cashReceipt.get('currency'),
        isPosted = cashReceipt.get('isPosted'),
        detail = this.get('cashReceiptDetail'),
        applied = detail ? detail.get('amount') : 0,
        receivable = this.get('receivable'),
        arApplied = this.get('receivableApplied'),
        arCurrency = receivable.get('currency'),
        arBalance = this.get('balance'),
        documentType = receivable.get('documentType'),
        store = receivable.get('store'); 
        
    // calculate balance in cash receipt currency
    arBalance = SC.Math.round(arBalance + arApplied, XT.MONEY_SCALE);
  
    // values must be valid
    discount = discount || 0;
    if (amount < 0 || discount < 0 || 
        amount + discount - applied > arBalance ||
        isPosted) return false;
  
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
    
    // create a new pending application record
    this._xm_createPending(amount + discount);

    return detail;
  },
  
  applyBalance: function() {
    var applied = this.get('applied'),
        arApplied = this.get('receivableApplied'),
        cashReceipt = this.get('cashReceipt'),
        crCurrencyRate = cashReceipt.get('currencyRate'),
        crBalance = cashReceipt.get('balance'),
        receivable = this.get('receivable'),
        documentType = receivable.get('documentType'),
        arCurrencyRate = receivable.get('currencyRate'),
        arBalance = receivable.get('balance') - receivable.get('pending'),
        documentDate = receivable.get('documentDate'),
        terms = receivable.get('terms'),
        discountDate = terms ? terms.calculateDiscountDate(documentDate) : null,
        discountPercent = terms ? terms.get('discountPercent') / 100 : 0,
        discount = 0, amount, arApplied;

    // determine balance we could apply in cash receipt currency
    amount = SC.Math.round(crBalance + applied, XT.MONEY_SCALE);
    arBalance = SC.Math.round(arBalance + arApplied, XT.MONEY_SCALE);
        
    // bail out if nothing to do
    if (arBalance === 0 || amount === 0) return this.get('detail');
    
    // calculate discount if applicable
    if (arBalance > 0 && discountDate && 
        SC.DateTime.compareDate(documentDate, discountDate) <= 0) {
      discount = SC.Math.round(arBalance * discountPercent, XT.MONEY_SCALE);
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
    
    // if there was nothing to apply
    return false;
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
    applications. This action is asynchronous.
    
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
        storeKey, pending, that = this;
 
    // make sure we have some kind of valid application date
    applicationDate = applicationDate ? applicationDate : (distributionDate ? distributionDate : SC.DateTime.create());
    
    // callback to create a pending application record once we've determined the 
    // value in the receivable's currency
    callback = function(err, result) {
      if (err) {
        that.error(err);
        return;
      }
      that.log('Creating pending application');

      // create a pending application record (info only, the datasource will ignore this)
      storeKey = store.loadRecord(XM.PendingApplication, {
        guid: detail.get('id'),
        pendingApplicationType: XM.PendingApplication.CASH_RECEIPT,
        receivable: receivable,
        amount: result
      });
      pending = store.materializeRecord(storeKey);
      
      // bind the ids of detail (which may have a temporory id at this time)
      // we may need to reference this later if this application gets cleared
      SC.Binding.from('id', detail).to('id', pending).oneWay().noDelay().connect();
      
      // push new pending record into pending applications array
      applications.pushObject(pending);
    }
    
    // request the converted value
    XM.Currency.toCurrency(crCurrency, arCurrency, amount, applicationDate, callback);
  },
  
  // .................................................
  // OBSERVERS
  //
  
  /** @private
    if the application date changed, recalculate the pending value as necessary.
  */
  _xm_applicationDateDidChange: function() {
    var amount = this.get('applied') + this.get('discount');
    if (amount) {
      this._xm_removePending();
      this._xm_createPending(amount);
    }
  }.observes('applicationDate')
  
});

