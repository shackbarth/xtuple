// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UserAccountInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UserAccountInfo = {
  /** @scope XM.UserAccountInfo.prototype */
  
  className: 'XM.UserAccountInfo',

  

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
    @type String
  */
  username: SC.Record.attr(String, {
    label: '_username'.loc()
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
  propername: SC.Record.attr(String, {
    label: '_propername'.loc()
  })

};
