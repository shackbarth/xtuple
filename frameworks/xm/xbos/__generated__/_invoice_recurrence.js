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
XM._InvoiceRecurrence = XM.Record.extend(
  /** @scope XM._InvoiceRecurrence.prototype */ {
  
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
  invoice: SC.Record.toOne('XM.Invoice'),

  /**
    @type String
  */
  period: SC.Record.attr(String),

  /**
    @type Number
  */
  frequency: SC.Record.attr(Number),

  /**
    @type Date
  */
  startDate: SC.Record.attr(Date),

  /**
    @type Date
  */
  endDate: SC.Record.attr(Date),

  /**
    @type Number
  */
  maximum: SC.Record.attr(Number)

});
