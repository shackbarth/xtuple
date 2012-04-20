// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Currency
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Currency = {
  /** @scope XM.Currency.prototype */
  
  className: 'XM.Currency',

  

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
  name: SC.Record.attr(String, {
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  symbol: SC.Record.attr(String, {
    label: '_symbol'.loc()
  }),

  /**
    @type String
  */
  abbreviation: SC.Record.attr(String, {
    isRequired: true,
    label: '_abbreviation'.loc()
  }),

  /**
    @type Boolean
  */
  isBase: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isBase'.loc()
  })

};
