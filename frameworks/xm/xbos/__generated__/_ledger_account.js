// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LedgerAccount
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._LedgerAccount = XM.Record.extend(
  /** @scope XM.LedgerAccount.prototype */ {
  
  className: 'XM.LedgerAccount',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainChartOfAccounts",
      "read": "MaintainChartOfAccounts",
      "update": "MaintainChartOfAccounts",
      "delete": "MaintainChartOfAccounts"
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
  company: SC.Record.attr(String),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  externalReference: SC.Record.attr(String),

  /**
    @type String
  */
  type: SC.Record.attr(String),

  /**
    @type String
  */
  subType: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
