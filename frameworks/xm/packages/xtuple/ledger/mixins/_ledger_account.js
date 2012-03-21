// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LedgerAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._LedgerAccount = {
  /** @scope XM.LedgerAccount.prototype */
  
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
  company: SC.Record.attr(String, {
    label: '_company'.loc()
  }),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String, {
    label: '_profitCenter'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String, {
    label: '_subAccount'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type String
  */
  externalReference: SC.Record.attr(String, {
    label: '_externalReference'.loc()
  }),

  /**
    @type String
  */
  accountType: SC.Record.attr(String, {
    label: '_accountType'.loc()
  }),

  /**
    @type String
  */
  subType: SC.Record.attr(String, {
    label: '_subType'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
