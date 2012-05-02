// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankAccountAdjustment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankAccountAdjustment = {
  /** @scope XM.BankAccountAdjustment.prototype */
  
  className: 'XM.BankAccountAdjustment',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainBankAdjustments",
      "read": "MaintainBankAdjustments",
      "update": "MaintainBankAdjustments",
      "delete": "MaintainBankAdjustments"
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
    @type XM.BankAccountAdjustmentType
  */
  bankAccountAdjustmentType: SC.Record.toOne('XM.BankAccountAdjustmentType'),

  /**
    @type Date
  */
  created: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String),

  /**
    @type Date
  */
  date: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number),

  /**
    @type Date
  */
  notes: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Number
  */
  sequence: SC.Record.attr(Number),

  /**
    @type Number
  */
  isPosted: SC.Record.attr(Number)

};
