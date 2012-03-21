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
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  yearEndLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_yearEndLedgerAccount'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  gainLossLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_gainLossLedgerAccount'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  discrepencyLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_discrepencyLedgerAccount'.loc()
  })

};
