// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliationUnreconciled
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._BankReconciliationUnreconciled = XM.Record.extend(
  /** @scope XM.BankReconciliationUnreconciled.prototype */ {
  
  className: 'XM.BankReconciliationUnreconciled',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
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
  date: SC.Record.attr(String),

  /**
    @type String
  */
  documentType: SC.Record.attr(String),

  /**
    @type Number
  */
  documentNumber: SC.Record.attr(Number),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
