// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CashReceiptApplication
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CashReceiptApplication = XM.Record.extend(
  /** @scope XM.CashReceiptApplication.prototype */ {
  
  className: 'XM.CashReceiptApplication',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "false",
      "read": "true",
      "update": "false",
      "delete": "false"
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
  cashReceipt: SC.Record.toOne('XM.CashReceipt'),

  /**
    @type XM.Receivable
  */
  receivable: SC.Record.toOne('XM.Receivable'),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  discount: SC.Record.attr(Number)

});
