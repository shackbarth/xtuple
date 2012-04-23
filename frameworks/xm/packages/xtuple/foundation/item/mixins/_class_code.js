// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ClassCode
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ClassCode = {
  /** @scope XM.ClassCode.prototype */
  
  className: 'XM.ClassCode',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainClassCodes",
      "read": true,
      "update": "MaintainClassCodes",
      "delete": "MaintainClassCodes"
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
  code: SC.Record.attr(String, {
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  })

};
