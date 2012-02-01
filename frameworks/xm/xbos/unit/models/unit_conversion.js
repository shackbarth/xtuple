// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.UnitConversion = XM.Record.extend(
    /** @scope XM.UnitConversion.prototype */ {

  className: 'XM.UnitConversion',

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
  fractional: SC.Record.attr(Boolean),

});
