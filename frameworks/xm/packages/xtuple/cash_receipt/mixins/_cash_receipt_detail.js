// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CashReceiptDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CashReceiptDetail = {
  /** @scope XM.CashReceiptDetail.prototype */
  
  className: 'XM.CashReceiptDetail',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.CashReceipt
  */
  cashReceipt: SC.Record.toOne('XM.CashReceipt', {
    isRequired: true
  }),

  /**
    @type XM.CashReceiptReceivable
  */
  receivable: SC.Record.toOne('XM.CashReceiptReceivable', {
    isRequired: true
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    isRequired: true
  }),

  /**
    @type Money
  */
  discount: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0
  })

};
