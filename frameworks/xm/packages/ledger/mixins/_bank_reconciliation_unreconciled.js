// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliationUnreconciled
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankReconciliationUnreconciled = {
  /** @scope XM.BankReconciliationUnreconciled.prototype */
  
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
  bankReconciliation: SC.Record.toOne('XM.BankReconciliation', {
    label: '_bankReconciliation'.loc()
  }),

  /**
    @type String
  */
  date: SC.Record.attr(String, {
    label: '_date'.loc()
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String, {
    label: '_documentType'.loc()
  }),

  /**
    @type Number
  */
  documentNumber: SC.Record.attr(Number, {
    label: '_documentNumber'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
