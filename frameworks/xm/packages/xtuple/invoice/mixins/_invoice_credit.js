// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.InvoiceCredit
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._InvoiceCredit = {
  /** @scope XM.InvoiceCredit.prototype */
  
  className: 'XM.InvoiceCredit',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
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
    @type XM.Invoice
  */
  invoice: SC.Record.toOne('XM.Invoice', {
    label: '_invoice'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  })

};
