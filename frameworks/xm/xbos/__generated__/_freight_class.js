// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._FreightClass = XM.Record.extend(
  /** @scope XM._FreightClass.prototype */ {
  
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
  code: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String)

});
