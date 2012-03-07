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
XM._CurrencyRate = XM.Record.extend(
  /** @scope XM._CurrencyRate.prototype */ {
  
  className: 'XM.CurrencyRate',

  

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
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  rate: SC.Record.attr(Number),

  /**
    @type Date
  */
  effective: SC.Record.attr(Date),

  /**
    @type Date
  */
  expires: SC.Record.attr(Date)

});
