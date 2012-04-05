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
  
  cashReceiptdetail: null,
  
  /** @private */
  applied: 0,
  
  /** @private */
  appliedBinding: SC.Binding.from('*cashReceiptDetail.amount').oneWay().noDelay(),
  
  /** @private */
  discount: 0,
  
  /** @private */
  discountBinding: SC.Binding.from('*cashReceiptDetail.discount').oneWay().noDelay(),
  
  /** @private */
  currencyRate: 1,
  
  /** @private */
  currencyRateBinding: SC.Binding.from('*cashReceiptDetail.cashReceipt.currencyRate').oneWay().noDelay(),
  
  /** @private */
  pendingApplicationsLength: 0,
  
  /** @private */
  pendingApplicationsLengthBinding: SC.Binding.from('*receivable.pendingApplications.length').oneWay().noDelay(),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total applied amount of this cash receipt in the currency of the receivable.
    
    @type Number
  */
  receivableApplied: function() {
    var applied = this.get('applied'),
        discount = this.get('discount'),
        crCurrencyRate = this.get('currencyRate') || 1,
        arCurrencyRate = this.getPath('receivable.currencyRate');
    return SC.Math.round((applied + discount) * arCurrencyRate / crCurrencyRate, XT.MONEY_SCALE);
  }.property('applied', 'currencyRate'),
  
  /**
    Total value of applications that have been created, but not posted, on the receivable
    in the receivable's currency.
    
    @type Number
  */
  pending: function() {
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
  }.property('pendingApplicationsLength', 'applied', 'currencyRate'),

  /**
    @type Number
  */  
  balance: function() {
    var balance = this.getPath('receivable.balance'),
        pending = this.get('pending');
    return SC.Math.round(balance - pending, XT.MONEY_SCALE);
  }.property('pending')
  
});

