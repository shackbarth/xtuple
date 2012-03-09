// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VoucherRecurrence
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._VoucherRecurrence = XM.Record.extend(
  /** @scope XM.VoucherRecurrence.prototype */ {
  
  className: 'XM.VoucherRecurrence',

  

  // .................................................
  // PRIVILEGES
  //

  

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.Voucher
  */
  voucher: SC.Record.toOne('XM.Voucher'),

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
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  endDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Number
  */
  maximum: SC.Record.attr(Number)

});
