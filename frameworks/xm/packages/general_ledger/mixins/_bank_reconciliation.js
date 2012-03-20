// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliation
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankReconciliation = {
  /** @scope XM.BankReconciliation.prototype */
  
  className: 'XM.BankReconciliation',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainBankRec",
      "read": "MaintainBankRec",
      "update": "MaintainBankRec",
      "delete": "MaintainBankRec"
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
    @type XM.BankAccountInfo
  */
  bankAccount: SC.Record.toOne('XM.BankAccountInfo', {
    isNested: true,
    label: '_bankAccount'.loc()
  }),

  /**
    @type Date
  */
  openDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_openDate'.loc()
  }),

  /**
    @type Date
  */
  endDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_endDate'.loc()
  }),

  /**
    @type Number
  */
  openBalance: SC.Record.attr(Number, {
    label: '_openBalance'.loc()
  }),

  /**
    @type Number
  */
  endBalance: SC.Record.attr(Number, {
    label: '_endBalance'.loc()
  }),

  /**
    @type XM.BankReconciliationItem
  */
  items: SC.Record.toMany('XM.BankReconciliationItem', {
    isNested: true,
    inverse: 'bankReconciliation',
    label: '_items'.loc()
  }),

  /**
    @type XM.BankReconciliationUnreconciled
  */
  unreconciled: SC.Record.toMany('XM.BankReconciliationUnreconciled', {
    isNested: true,
    inverse: 'bankReconciliation',
    label: '_unreconciled'.loc()
  }),

  /**
    @type String
  */
  isPosted: SC.Record.attr(String, {
    label: '_isPosted'.loc()
  }),

  /**
    @type Date
  */
  postDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_postDate'.loc()
  }),

  /**
    @type Date
  */
  created: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_created'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
