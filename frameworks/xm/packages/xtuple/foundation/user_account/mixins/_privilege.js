// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Privilege
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Privilege = {
  /** @scope XM.Privilege.prototype */
  
  className: 'XM.Privilege',

  

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
  module: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String)

};
