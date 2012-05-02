// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PayableLedgerAccounts
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._PayableLedgerAccounts = {
  /** @scope XM.PayableLedgerAccounts.prototype */
  
  className: 'XM.PayableLedgerAccounts',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainVendorAccounts",
      "read": "MaintainVendorAccounts",
      "update": "MaintainVendorAccounts",
      "delete": "MaintainVendorAccounts"
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
    @type XM.VendorType
  */
  vendorType: SC.Record.toOne('XM.VendorType'),

  /**
    @type String
  */
  vendorTypePattern: SC.Record.attr(String),

  /**
    @type XM.LedgerAccountInfo
  */
  payablesLedgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  prepaidledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  discountledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  })

};
