// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TrialBalance
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TrialBalance = {
  /** @scope XM.TrialBalance.prototype */
  
  className: 'XM.TrialBalance',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewTrialBalances",
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
  }),

  /**
    @type Number
  */
  beginning: SC.Record.attr(Number, {
    label: '_beginning'.loc()
  }),

  /**
    @type Number
  */
  ending: SC.Record.attr(Number, {
    label: '_ending'.loc()
  }),

  /**
    @type Number
  */
  credits: SC.Record.attr(Number, {
    label: '_credits'.loc()
  }),

  /**
    @type Number
  */
  debits: SC.Record.attr(Number, {
    label: '_debits'.loc()
  })

};
