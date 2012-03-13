// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliationItem
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._BankReconciliationItem = XM.Record.extend(
  /** @scope XM.BankReconciliationItem.prototype */ {
  
  className: 'XM.BankReconciliationItem',

  

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
    @type XM.BankReconciliation
  */
  bankReconciliation: SC.Record.toOne('XM.BankReconciliation'),

  /**
    @type String
  */
  sourceType: SC.Record.attr(String),

  /**
    @type Number
  */
  source: SC.Record.attr(Number),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number)

});
