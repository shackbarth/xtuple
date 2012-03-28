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
  payable: SC.Record.toOne('XM.Payable', {
    label: '_payable'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.BankAccount
  */
  bankAccount: SC.Record.toOne('XM.BankAccount', {
    label: '_bankAccount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
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
    @type Number
  */
  discount: SC.Record.attr(Number, {
    label: '_discount'.loc()
  })

};
