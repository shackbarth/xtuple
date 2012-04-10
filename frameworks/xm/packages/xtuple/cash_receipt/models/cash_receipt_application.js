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
XM.CashReceiptApplication = SC.Object.extend(
  /** @scope XM.CashReceiptApplication.prototype */ {
  
  cashReceipt: null,
  
  cashReceiptDetail: null,
  
  receivable: null,

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    The amount to be applied to the associated receivable.
    
    @type Number
  */
  applied: function() {
    return this.getPath('cashReceiptDetail.amount') || 0;
  }.property('*cashReceiptDetail.amount').cacheable(),

  /**
    The discount to be applied to the associated receivable.
    
    @type Number
  */
  discount: function() {
    return this.getPath('cashReceiptDetail.discount') || 0;
  }.property('*cashReceiptDetail.discount').cacheable(),
  
  /**
    Total applied amount of this cash receipt in the currency of the receivable.
    
    @type Number
  */
  receivableApplied: function() {
    var applied = this.get('applied'),
        discount = this.get('discount'),
        crCurrencyRate = this.getPath('cashReceipt.currencyRate') || 1,
        arCurrencyRate = this.getPath('receivable.currencyRate');
    return SC.Math.round((applied + discount) * arCurrencyRate / crCurrencyRate, XT.MONEY_SCALE);
  }.property('applied', 'discount').cacheable(),
  
  /**
    Total value of applications that have been created, but not posted, on the receivable
    in the receivable's currency.
    
    @type Number
  */
  allPending: function() {
    var applications = this.getPath('receivable.pendingApplications'),
        id = this.getPath('cashReceiptDetail.id') || -1,
        receivableApplied = this.get('receivableApplied'), 
        pending = 0;
    
    // loop through all pending applications and add them up
    for (var i = 0; i < applications.get('length'); i++) {
      var application = applications.objectAt(i),
          pendingApplicationType = application.get('receivablePendingApplicationType'),
          amount = application.get('amount');
          
      // only include pending applications that are not the application from _this_ receipt
      if (pendingApplicationType !== XM.ReceivablePendingApplication.CASH_RECEIPT || 
          application.get('id') !== id) {
        pending += amount;
      }
    }
    
    // now add the amount applied from this application
    pending += receivableApplied;
    return SC.Math.round(pending, XT.MONEY_SCALE);
  }.property('*receivable.pendingApplications.length', 'receivableApplied').cacheable(),

  /**
    The balance due on the receivable in the receivable's currency.
    
    @type Number
  */  
  balance: function() {
    var balance = this.getPath('receivable.balance'),
        allPending = this.get('allPending');
    return SC.Math.round(balance - allPending, XT.MONEY_SCALE);
  }.property('allPending').cacheable(),
  
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
        detail = this.get('cashReceiptDetail'),
        receivable = this.get('receivable'),
        applied = detail ? detail.get('amount') : 0,
        balance = receivable.get('balance'),
        store = receivable.get('store'); 
    
    // values must be valid
    discount = discount || 0;
    if (amount < 0 || discount < 0 || 
        amount + discount - applied > balance) return false;
  
    // update the detail
    if (detail) {
      detail.set('amount', amount);
      detail.set('discount', discount);

    // create the detail
    } else {
      detail = store.createRecord(XM.CashReceiptDetail, {});
      detail.set('receivable', receivable)
            .set('amount', amount)
            .set('discount', discount)
            .normalize();
      cashReceipt.get('details').pushObject(detail);
      
      // associate detail to this application
      this.set('cashReceiptDetail', detail);
      
      // associate detail to pending applications
      receivable.get('pendingApplications').pushObject(detail);
    }
    
    return detail;
  },
  
  applyBalance: function() {
  },
  
  clear: function() {
    var detail = this.get('cashReceiptDetail');
    if (detail) detail.destroy();
    this.set('cashReceiptDetail', null);
  }
  
  // .................................................
  // OBSERVERS
  //
  
});

