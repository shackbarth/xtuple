// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.AddressInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._AddressInfo = {
  /** @scope XM.AddressInfo.prototype */
  
  className: 'XM.AddressInfo',

  

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
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  line1: SC.Record.attr(String, {
    label: '_line1'.loc()
  }),

  /**
    @type String
  */
  line2: SC.Record.attr(String, {
    label: '_line2'.loc()
  }),

  /**
    @type String
  */
  line3: SC.Record.attr(String, {
    label: '_line3'.loc()
  }),

  /**
    @type String
  */
  city: SC.Record.attr(String, {
    label: '_city'.loc()
  }),

  /**
    @type String
  */
  state: SC.Record.attr(String, {
    label: '_state'.loc()
  }),

  /**
    @type String
  */
  postalCode: SC.Record.attr(String, {
    label: '_postalCode'.loc()
  }),

  /**
    @type String
  */
  country: SC.Record.attr(String, {
    label: '_country'.loc()
  })

};
