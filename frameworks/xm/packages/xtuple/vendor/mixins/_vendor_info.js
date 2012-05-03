// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VendorInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._VendorInfo = {
  /** @scope XM.VendorInfo.prototype */
  
  className: 'XM.VendorInfo',

  

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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency')

};
