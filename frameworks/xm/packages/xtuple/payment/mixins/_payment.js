// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Payment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Payment = {
  /** @scope XM.Payment.prototype */
  
  className: 'XM.Payment',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainPayments",
      "read": "ViewPayments",
      "update": "MaintainPayments",
      "delete": "MaintainPayments"
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
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount', {
    label: '_bankAccount'.loc()
  }),

  /**
    @type Date
  */
  paymentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_paymentDate'.loc()
  }),

  /**
    @type Number
  */
  number: SC.Record.attr(Number, {
    label: '_number'.loc()
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
    @type Boolean
  */
  isMiscellaneous: SC.Record.attr(Boolean, {
    label: '_isMiscellaneous'.loc()
  }),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean, {
    label: '_isPrinted'.loc()
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
    @type Boolean
  */
  isReplaced: SC.Record.attr(Boolean, {
    label: '_isReplaced'.loc()
  }),

  /**
    @type XM.ExpenseCategory
  */
  expenseCategory: SC.Record.toOne('XM.ExpenseCategory', {
    label: '_expenseCategory'.loc()
  }),

  /**
    @type String
  */
  for: SC.Record.attr(String, {
    label: '_for'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  isDeleted: SC.Record.attr(Boolean, {
    label: '_isDeleted'.loc()
  }),

  /**
    @type String
  */
  achBatch: SC.Record.attr(String, {
    label: '_achBatch'.loc()
  }),

  /**
    @type XM.PaymentDetail
  */
  details: SC.Record.toMany('XM.PaymentDetail', {
    isNested: true,
    inverse: 'payment',
    label: '_details'.loc()
  })

};
