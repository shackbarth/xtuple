// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ReceivableLedgerAccounts
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ReceivableLedgerAccounts = {
  /** @scope XM.ReceivableLedgerAccounts.prototype */
  
  className: 'XM.ReceivableLedgerAccounts',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainSalesAccount",
      "read": "MaintainSalesAccount",
      "update": "MaintainSalesAccount",
      "delete": "MaintainSalesAccount"
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
    @type XM.CustomerType
  */
  customerType: SC.Record.toOne('XM.CustomerType', {
    label: '_customerType'.loc()
  }),

  /**
    @type String
  */
  customerTypePattern: SC.Record.attr(String, {
    label: '_customerTypePattern'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  receivablesLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_receivablesLedgerAccount'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  prepaidledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_prepaidledgerAccount'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  deferredLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_deferredLedgerAccount'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  discountledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_discountledgerAccount'.loc()
  })

};
