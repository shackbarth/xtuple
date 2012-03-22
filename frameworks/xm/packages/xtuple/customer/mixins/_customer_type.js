// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerType = {
  /** @scope XM.CustomerType.prototype */
  
  className: 'XM.CustomerType',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCustomerTypes",
      "read": true,
      "update": "MaintainCustomerTypes",
      "delete": "MaintainCustomerTypes"
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
