// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  @extends XT.Record
*/
XM.CashReceiptApplicationController = SC.Object.extend(
  /** @scope XM.CashReceiptApplication.prototype */ {
  
  /**
    @type XM.Receivable
  */
  receivable: null,
  
  /**
    @type XM.CashReceiptDetail
  */
  cashReceiptDetail: null,

  /**
    @type XM.Money
  */  
  balance: null,
  
  /**
    @type XM.Money
  */  
  applied: null,
    
  /**
    @type XM.Money
  */
  pending: null,
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.set('balance', XM.Money.create());
    this.set('applied', XM.Money.create());
    this.set('pending', XM.Money.create());
  }
  
  
});

