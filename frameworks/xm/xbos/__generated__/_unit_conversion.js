// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UnitConversion
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._UnitConversion = XM.Record.extend(
  /** @scope XM.UnitConversion.prototype */ {
  
  className: 'XM.UnitConversion',

  

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
  toValue: SC.Record.attr(Number)

});
