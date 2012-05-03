// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Priority
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Priority = {
  /** @scope XM.Priority.prototype */
  
  className: 'XM.Priority',

  

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
    isRequired: true
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    defaultValue: 0
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String)

};
