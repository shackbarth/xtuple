// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VoucherRecurrence
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._VoucherRecurrence = {
  /** @scope XM.VoucherRecurrence.prototype */
  
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
  voucher: SC.Record.toOne('XM.Voucher', {
    label: '_voucher'.loc()
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
