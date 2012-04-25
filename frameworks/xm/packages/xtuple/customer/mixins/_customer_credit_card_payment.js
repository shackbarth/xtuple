// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerCreditCardPayment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerCreditCardPayment = {
  /** @scope XM.CustomerCreditCardPayment.prototype */
  
  className: 'XM.CustomerCreditCardPayment',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "false",
      "read": "ProcessCreditCards",
      "update": "false",
      "delete": "false"
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
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    label: '_customer'.loc()
  }),

  /**
    @type String
  */
  customerCreditCardPaymentType: SC.Record.attr(String, {
    label: '_customerCreditCardPaymentType'.loc()
  }),

  /**
    @type String
  */
  customerCreditCardPaymentStatus: SC.Record.attr(String, {
    label: '_customerCreditCardPaymentStatus'.loc()
  }),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String, {
    label: '_documentNumber'.loc()
  }),

  /**
    @type String
  */
  reference: SC.Record.attr(String, {
    label: '_reference'.loc()
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
    @type Date
  */
  created: SC.Record.attr(XT.DateTime, {
    useIsoDate: true,
    label: '_created'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
