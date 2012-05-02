// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PaymentApproval
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._PaymentApproval = {
  /** @scope XM.PaymentApproval.prototype */
  
  className: 'XM.PaymentApproval',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainPayments",
      "read": "MaintainPayments",
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
    @type XM.Payable
  */
  payable: SC.Record.toOne('XM.Payable'),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount'),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Date
  */
  date: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Number
  */
  discount: SC.Record.attr(Number)

};
