// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemConversion
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ItemConversion = XM.Record.extend(
  /** @scope XM.ItemConversion.prototype */ {
  
  className: 'XM.ItemConversion',

  

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
    @type XM.Item
  */
  item: SC.Record.toOne('XM.Item'),

  /**
    @type XM.Unit
  */
  fromUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Number
  */
  fromValue: SC.Record.attr(Number),

  /**
    @type XM.Unit
  */
  toUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Number
  */
  toValue: SC.Record.attr(Number),

  /**
    @type Boolean
  */
  fractional: SC.Record.attr(Boolean)

});
