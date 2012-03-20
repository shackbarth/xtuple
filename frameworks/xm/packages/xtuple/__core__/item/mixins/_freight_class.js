// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FreightClass
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._FreightClass = {
  /** @scope XM.FreightClass.prototype */
  
  className: 'XM.FreightClass',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainFreightClasses",
      "read": true,
      "update": "MaintainFreightClasses",
      "delete": "MaintainFreightClasses"
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
