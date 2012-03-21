// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PaymentDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._PaymentDetail = {
  /** @scope XM.PaymentDetail.prototype */
  
  className: 'XM.PaymentDetail',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
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
    @type XM.Payment
  */
  payment: SC.Record.toOne('XM.Payment', {
    label: '_payment'.loc()
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
    @type Number
  */
  discount: SC.Record.attr(Number, {
    label: '_discount'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_documentDate'.loc()
  })

};
