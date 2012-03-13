// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Currency
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Currency = XM.Record.extend(
  /** @scope XM.Currency.prototype */ {
  
  className: 'XM.Currency',

  nestedRecordNamespace: XM,

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
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  symbol: SC.Record.attr(String),

  /**
    @type String
  */
  abbreviation: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isBase: SC.Record.attr(Boolean),

  /**
    @type XM.CurrencyRate
  */
  rates: SC.Record.toMany('XM.CurrencyRate', {
    isNested: true,
    inverse: 'currency'
  })

});
