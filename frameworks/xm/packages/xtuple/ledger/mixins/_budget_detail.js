// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BudgetDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BudgetDetail = {
  /** @scope XM.BudgetDetail.prototype */
  
  className: 'XM.BudgetDetail',

  nestedRecordNamespace: XM,

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
    @type Number
  */
  budget: SC.Record.toOne(Number, {
    label: '_budget'.loc()
  }),

  /**
    @type XM.Period
  */
  period: SC.Record.toOne('XM.Period', {
    label: '_period'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_ledgerAccount'.loc()
  })

};
