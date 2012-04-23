// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Country
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Country = {
  /** @scope XM.Country.prototype */
  
  className: 'XM.Country',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCountries",
      "read": true,
      "update": "MaintainCountries",
      "delete": "MaintainCountries"
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
  abbreviation: SC.Record.attr(String, {
    label: '_abbreviation'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  currencyName: SC.Record.attr(String, {
    label: '_currencyName'.loc()
  }),

  /**
    @type String
  */
  currencySymbol: SC.Record.attr(String, {
    label: '_currencySymbol'.loc()
  }),

  /**
    @type String
  */
  currencyAbbreviation: SC.Record.attr(String, {
    label: '_currencyAbbreviation'.loc()
  }),

  /**
    @type String
  */
  currencyNumber: SC.Record.attr(String, {
    label: '_currencyNumber'.loc()
  }),

  /**
    @type XM.State
  */
  states: SC.Record.toMany('XM.State', {
    label: '_states'.loc()
  })

};
