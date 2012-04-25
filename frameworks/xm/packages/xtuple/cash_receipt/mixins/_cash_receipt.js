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
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    isRequired: true,
    label: '_customer'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    isRequired: true,
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
    defaultValue: function() {
      return XM.Currency.BASE;
    },
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    defaultValue: 1,
    label: '_currencyRate'.loc()
  }),

  /**
    @type String
  */
  fundsType: SC.Record.attr(String, {
    isRequired: true,
    label: '_fundsType'.loc()
  }),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String, {
    label: '_documentNumber'.loc()
  }),

  /**
    @type Boolean
  */
  isUseCustomerDeposit: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false,
    label: '_isUseCustomerDeposit'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_documentDate'.loc()
  }),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount', {
    isRequired: true,
    label: '_bankAccount'.loc()
  }),

  /**
    @type Date
  */
  distributionDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    },
    label: '_distributionDate'.loc()
  }),

  /**
    @type Date
  */
  applicationDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    },
    label: '_applicationDate'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false,
    label: '_isPosted'.loc()
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false,
    label: '_isVoid'.loc()
  }),

  /**
    @type XM.CashReceiptDetail
  */
  details: SC.Record.toMany('XM.CashReceiptDetail', {
    isNested: true,
    inverse: 'cashReceipt',
    label: '_details'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Date
  */
  posted: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_posted'.loc()
  }),

  /**
    @type String
  */
  postedBy: SC.Record.attr(String, {
    label: '_postedBy'.loc()
  })

};
