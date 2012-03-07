// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CashReceipt = XM.Record.extend(
  /** @scope XM._CashReceipt.prototype */ {
  
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
  number: SC.Record.attr(String),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer'),

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
    @type String
  */
  fundsType: SC.Record.attr(String),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory'),

  /**
    @type Boolean
  */
  useCustomerDeposit: SC.Record.attr(Boolean),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount'),

  /**
    @type Date
  */
  applyDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean),

  /**
    @type XM.CashReceiptApplication
  */
  applications: SC.Record.toMany('XM.CashReceiptApplication', {
    isNested: true,
    inverse: 'cashReceipt'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
