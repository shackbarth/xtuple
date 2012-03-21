// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CashReceipt
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CashReceipt = {
  /** @scope XM.CashReceipt.prototype */
  
  className: 'XM.CashReceipt',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCashReceipts",
      "read": "ViewCashReceipts",
      "update": "MaintainCashReceipts",
      "delete": "MaintainCashReceipts"
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
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    label: '_customer'.loc()
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
    @type String
  */
  fundsType: SC.Record.attr(String, {
    label: '_fundsType'.loc()
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    label: '_salesCategory'.loc()
  }),

  /**
    @type Boolean
  */
  useCustomerDeposit: SC.Record.attr(Boolean, {
    label: '_useCustomerDeposit'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_documentDate'.loc()
  }),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount', {
    label: '_bankAccount'.loc()
  }),

  /**
    @type Date
  */
  applyDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_applyDate'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    label: '_isPosted'.loc()
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    label: '_isVoid'.loc()
  }),

  /**
    @type XM.CashReceiptApplication
  */
  applications: SC.Record.toMany('XM.CashReceiptApplication', {
    isNested: true,
    inverse: 'cashReceipt',
    label: '_applications'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
