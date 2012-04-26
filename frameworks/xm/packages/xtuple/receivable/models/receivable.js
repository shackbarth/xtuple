// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_receivable');

/**
  @class

  @extends XM.SubLedger
*/
XM.Receivable = XM.SubLedger.extend(XM._Receivable,
  /** @scope XM.Receivable.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
    Returns the color of the incident corresponding with its status.
    
    @type String
  */
  color: function() {
    var documentType = this.get('documentType'),
        K = XM.SubLedger, ret;
    switch (documentType) {
      case K.CREDIT_MEMO:
        ret = XT.EMPHASIS;
        break;
      case K.CUSTOMER_DEPOSIT:
        ret = XT.ALTERNATE_EMPHASIS;
        break;
      default:
        ret = black;
    }
    return ret;
  }.property('documentType').cacheable(),
  
  /**
    Returns the status as a localized string.
    
    @type String
  */
  documentTypeString: function() {
    var documentType = this.get('documentType'),
        K = XM.SubLedger, ret;
    switch (documentType) {
      case K.INVOICE:
        ret = "_invoice".loc();
        break;
      case K.CREDIT_MEMO:
        ret = "_creditMemo".loc();
        break;
      case K.DEBIT_MEMO:
        ret = "_debitMemo".loc();
        break;
      case K.CUSTOMER_DEPOSIT:
        ret = "_customerDeposit".loc();
        break;
      default:
        ret = "_error".loc();
    }
    return ret;
  }.property('documentType').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  amountDidChange: function() {
    if (this.isNotDirty()) return;
    var amount = this.get('amount') || 0,
        commissionPct = this.getPath('customer.commission') || 0,
        commissionDue = amount * commissionPct / 100;
    this.setIfChanged('commissionDue', commissionDue);
  }.observes('customer', 'amount'),
  
  customerDidChange: function() {
    if (this.isNotDirty()) return;
    var customer = this.get('customer');
    if (customer) {
      this.setIfChanged('terms', customer.get('terms'));
      this.setIfChanged('salesRep', customer.get('salesRep'));
      this.setIfChanged('currency', customer.get('currency'));
    }
  }.observes('customer'),
  
  statusDidChange: function() {
    arguments.callee.base.apply(this, arguments);
    if (this.get('status') == SC.Record.READY_CLEAN) {
      this.customer.set('isEditable', false);
    }
  }.observes('status')
  
});

