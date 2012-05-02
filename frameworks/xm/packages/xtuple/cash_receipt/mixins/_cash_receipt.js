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
    isRequired: true
  }),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    isRequired: true
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    isRequired: true
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
    defaultValue: function() {
      return XM.Currency.BASE;
    }
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    defaultValue: 1
  }),

  /**
    @type String
  */
  fundsType: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isUseCustomerDeposit: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount', {
    isRequired: true
  }),

  /**
    @type Date
  */
  distributionDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    }
  }),

  /**
    @type Date
  */
  applicationDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    }
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type XM.CashReceiptDetail
  */
  details: SC.Record.toMany('XM.CashReceiptDetail', {
    isNested: true,
    inverse: 'cashReceipt'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Date
  */
  posted: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  postedBy: SC.Record.attr(String)

};
