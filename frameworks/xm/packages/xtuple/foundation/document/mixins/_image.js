// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Image
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Image = {
  /** @scope XM.Image.prototype */
  
  className: 'XM.Image',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainImages",
      "read": true,
      "update": "MaintainImages",
      "delete": "MaintainImages"
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
  description: SC.Record.attr(String),

  /**
    @type String
  */
  data: SC.Record.attr(String, {
    isRequired: true
  })

};
