// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

sc_require('mixins/_apply_credit');
sc_require('mixins/open_receivable');

/*globals XM */

/**
  @class
  
  An abstract class used to manage the application of credits.

  @extends XT.Record
  @extends XM.SubLedgerMixin
  @extends XM.OpenReceivable
*/
XM.ApplyCredit = XT.Record.extend(
  XM._ApplyCredit, XM.SubLedgerMixin, XM.OpenReceivable,
  /** @scope XM.ApplyCredit.prototype */ {

  /**
    @type Number
  */
  applied: 0,

  // .................................................
  // CALCULATED PROPERTIES
  //  
  
  /**
    @type Money
  */
  available: function() {
    var amount = this.get('amount'),
        paid = this.get('paid'),
        pending = this.get('pending'),
        applied = this.get('applied');
    return (amount - paid - pending + applied).toMoney();
  }.property('balance', 'pending').cacheable(),
  
  /**
    @type Money
  */
  balance: function() {
    var amount = this.get('amount'),
        paid = this.get('paid'),
        pending = this.get('pending');
    return (amount - paid - pending).toMoney();
  }.property('balance', 'pending').cacheable(),
  
  /**
    An array of open receivables for `CreditApply`.
    
    @type SC.Array
  */
  receivables: function() {
    var customer = this.get('customer'),
        store = this.get('store'), query;
      
    // query for the results
    query = SC.Query.local(XM.CashReceiptReceivable, {
      conditions: "customer = {customer} AND isOpen = YES",
      parameters: { customer: customer },
      orderBy: "dueDate"
    })
    return store.find(query);
  }.property().cacheable(),
  
  //..................................................
  // METHODS
  //
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.set('applied', new Money(0));
  },

  //..................................................
  // OBSERVERS
  //

});

