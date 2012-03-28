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
    isNested: true,
    label: '_bankAccount'.loc()
  }),

  /**
    @type XM.BankAccountAdjustmentType
  */
  bankAccountAdjustmentType: SC.Record.toOne('XM.BankAccountAdjustmentType', {
    label: '_bankAccountAdjustmentType'.loc()
  }),

  /**
    @type Date
  */
  created: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_created'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  }),

  /**
    @type Date
  */
  date: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_date'.loc()
  }),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String, {
    label: '_documentNumber'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  }),

  /**
    @type Date
  */
  notes: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_notes'.loc()
  }),

  /**
    @type Number
  */
  sequence: SC.Record.attr(Number, {
    label: '_sequence'.loc()
  }),

  /**
    @type Number
  */
  isPosted: SC.Record.attr(Number, {
    label: '_isPosted'.loc()
  })

};
