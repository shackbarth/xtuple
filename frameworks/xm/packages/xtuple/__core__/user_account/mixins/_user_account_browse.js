// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UserAccountBrowse
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UserAccountBrowse = {
  /** @scope XM.UserAccountBrowse.prototype */
  
  className: 'XM.UserAccountBrowse',

  

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
  })

};
