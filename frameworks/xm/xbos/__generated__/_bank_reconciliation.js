// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankReconciliation
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._BankReconciliation = XM.Record.extend(
  /** @scope XM.BankReconciliation.prototype */ {
  
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
    isNested: true
  }),

  /**
    @type Date
  */
  openDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  endDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Number
  */
  openBalance: SC.Record.attr(Number),

  /**
    @type Number
  */
  endBalance: SC.Record.attr(Number),

  /**
    @type XM.BankReconciliationItem
  */
  items: SC.Record.toMany('XM.BankReconciliationItem', {
    isNested: true,
    inverse: 'bankReconciliation'
  }),

  /**
    @type XM.BankReconciliationUnreconciled
  */
  unreconciled: SC.Record.toMany('XM.BankReconciliationUnreconciled', {
    isNested: true,
    inverse: 'bankReconciliation'
  }),

  /**
    @type String
  */
  isPosted: SC.Record.attr(String),

  /**
    @type Date
  */
  postDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  created: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
