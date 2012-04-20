// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt_distribution');

/**
  @class

  @extends XT.Record
*/
XM.CashReceiptDistribution = XT.Record.extend(XM._CashReceiptDistribution,
  /** @scope XM.CashReceiptDistribution.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  /**
    Update the cash receipt total when the amount changes
  */
  amountDidChange: function() {
    if (!this._xm_amountCache) this._xm_amountCache = 0;
    var cashReceipt = this.get('cashReceipt'),
        status = this.get('status'), K = SC.Record,
        amount = status & K.DESTROYED ? 0 : this.get('amount') || 0;
    if (cashReceipt) {
      cashReceipt.updateApplied(amount - this._xm_amountCache);
      this._xm_amountCache = amount;
    };
  }.observes('amount', 'status')

});

