// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.InvoiceRecurrence
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._InvoiceRecurrence = {
  /** @scope XM.InvoiceRecurrence.prototype */
  
  className: 'XM.InvoiceRecurrence',

  

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
    @type String
  */
  period: SC.Record.attr(String, {
    label: '_period'.loc()
  }),

  /**
    @type Number
  */
  frequency: SC.Record.attr(Number, {
    label: '_frequency'.loc()
  }),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_startDate'.loc()
  }),

  /**
    @type Date
  */
  endDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_endDate'.loc()
  }),

  /**
    @type Number
  */
  maximum: SC.Record.attr(Number, {
    label: '_maximum'.loc()
  })

};
