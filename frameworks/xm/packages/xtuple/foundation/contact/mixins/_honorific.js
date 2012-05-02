// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Honorific
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Honorific = {
  /** @scope XM.Honorific.prototype */
  
  className: 'XM.Honorific',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTitles",
      "read": "ViewTitles",
      "update": "MaintainTitles",
      "delete": "MaintainTitles"
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
  code: SC.Record.attr(String)

};
