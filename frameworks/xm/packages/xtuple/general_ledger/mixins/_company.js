// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Company
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Company = {
  /** @scope XM.Company.prototype */
  
  className: 'XM.Company',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainChartOfAccounts",
      "read": true,
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
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.LedgerAccountInfo
  */
  yearEndLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  gainLossLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  discrepancyLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  })

};
