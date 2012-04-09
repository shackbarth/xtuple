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
  
  receivable: null,
  
  cashReceiptDetail: null,
  
  /** @private */
  pendingApplicationsLength: 0,
  
  /** @private */
  pendingApplicationsLengthBinding: SC.Binding.from('*receivable.pendingApplications.length').oneWay().noDelay(),

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
        crCurrencyRate = this.getPath('cashReceiptDetail.cashReceipt.currencyRate') || 1,
        arCurrencyRate = this.getPath('receivable.currencyRate');
    return SC.Math.round((applied + discount) * arCurrencyRate / crCurrencyRate, XT.MONEY_SCALE);
  }.property('applied', 'discount', '*cashReceiptDetail.cashReceipt.currencyRate').cacheable(),
  
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
  }.property('pendingApplicationsLength', 'receivableApplied').cacheable(),

  /**
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
  
  clear: function() {
    var detail = this.get('cashReceiptDetail');
    if (detail) detail.destroy();
    this.set('cashReceiptDetail', null);
  }
  
  // .................................................
  // OBSERVERS
  //
  
});

