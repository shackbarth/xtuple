// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt_receivable');

/**
  @class

  @extends XM.SubLedger
*/
XM.CashReceiptReceivable = XT.Record.extend(XM._CashReceiptReceivable, XM.SubLedgerMixin,
  /** @scope XM.CashReceiptReceivable.prototype */ {

  /** @private */
  pendingApplicationsLength: 0,
  
  /** @private */
  pendingApplicationsLengthBinding: SC.Binding.from('*pendingApplications.length').oneWay().noDelay(),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total value of applications that have been created, but not posted, on the receivable
    in the receivable's currency.
    
    @type Number
  */
  pending: function() {
    var applications = this.getPath('pendingApplications'),
        pending = 0;
  
    // loop through all pending applications and add them up
    for (var i = 0; i < applications.get('length'); i++) {
      var application = applications.objectAt(i),
          status = application.get('status'), K = SC.Record;
      if ((status & K.DESTROYED) === 0) {
        pending += application.get('amount');
      }
    }

    return SC.Math.round(pending, XT.MONEY_SCALE);
  }.property('pendingApplicationsLength').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

