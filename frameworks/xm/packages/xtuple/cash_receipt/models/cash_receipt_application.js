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
  amount: 0,
  
  /** @private */
  amountBinding: SC.Binding.from('*cashReceiptDetail.amount').oneWay().noDelay(),
  
  /** @private */
  discount: 0,
  
  /** @private */
  discountBinding: SC.Binding.from('*cashReceiptDetail.discount').oneWay().noDelay(),
  
  /** @private */
  currency: XM.Currency.BASE,
  
  /** @private */
  currencyBinding: SC.Binding.from('*cashReceiptDetail.cashReceipt.currency').oneWay().noDelay(),
  
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
    Total value of applications that have been created, but not posted.
    
    @type Number
  */
  pending: function() {
    var applications = this.getPath('receivable.pendingApplications'),
        detail = this.getPath('detail'),
        pending = 0;
    for (var i = 0; i < applications.get('length'); i++) {
      var application = applications.objectAt(i),
          amount = application.get('amount'),
          discount = application.get('discount'),
          currencyRate = application.get('currencyRate') || 1
      if (application.get('id') !== detailId) {
        pending = SC.Math.round(pending + (amount + discount) * currencyRate, XT.MONEY_SCALE);
      }
    }
    return SC.Math.round(pending, XT.MONEY_SCALE);
  }.property('pendingApplicationsLength', 'amount', 'discount', 'currency', 'currencyRate'),

  /**
    @type Number
  */  
  balance: function() {
    if (!this._xm_balance) this._xm_balance = XM.Money.create({ isPosted: true });
    var balance = this.getPath('receivable.balance'),
        pending = this.getPath('receivable.pending'),
        currency = this.getPath('receivable.currency'),
        currencyRate
        applied = statusthis.get('applied');
    
    // update the applied money object
    this._xm_balance.setIfChanged('currency', currency);
    this._xm_balance.setIfChanged('currencyRate', currencyRate);
    this._xm_balance.setIfChanged('localValue', applied);
    
    return this._xm_applied;
  }.property('pending')
  
});

