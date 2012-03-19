// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemInfo
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ItemInfo = XM.Record.extend(
  /** @scope XM.ItemInfo.prototype */ {
  
  className: 'XM.ItemInfo',

  

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
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  description1: SC.Record.attr(String),

  /**
    @type String
  */
  description2: SC.Record.attr(String),

  /**
    @type XM.Unit
  */
  inventoryUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Number
  */
  listPrice: SC.Record.attr(Number)

});
