// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProductCategory
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProductCategory = {
  /** @scope XM.ProductCategory.prototype */
  
  className: 'XM.ProductCategory',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainProductCategories",
      "read": true,
      "update": "MaintainProductCategories",
      "delete": "MaintainProductCategories"
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
  code: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String)

};
