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
XM._Payment = XM.Record.extend(
  /** @scope XM._Payment.prototype */ {
  
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
  bankAccount: SC.Record.toOne('XM.BankAccount'),

  /**
    @type Date
  */
  paymentDate: SC.Record.attr(Date),

  /**
    @type Number
  */
  number: SC.Record.attr(Number),

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
    @type Boolean
  */
  isMiscellaneous: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isReplaced: SC.Record.attr(Boolean),

  /**
    @type XM.ExpenseCategory
  */
  expenseCategory: SC.Record.toOne('XM.ExpenseCategory'),

  /**
    @type String
  */
  for: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isDeleted: SC.Record.attr(Boolean),

  /**
    @type String
  */
  achBatch: SC.Record.attr(String),

  /**
    @type XM.PaymentDetail
  */
  details: SC.Record.toMany('XM.PaymentDetail', {
    isNested: true,
    inverse: 'payment'
  })

});
