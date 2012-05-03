// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankAccountAdjustmentType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankAccountAdjustmentType = {
  /** @scope XM.BankAccountAdjustmentType.prototype */
  
  className: 'XM.BankAccountAdjustmentType',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAdjustmentTypes",
      "read": true,
      "update": "MaintainAdjustmentTypes",
      "delete": "MaintainAdjustmentTypes"
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
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  ledgerAccount: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isCredit: SC.Record.toOne(Boolean)

};
