// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  @extends XM.Record
  @version 0.1
*/
XM.ItemConversionTypeAssignment = XM.Record.extend(
/** @scope XM.ItemConversionTypeAssignment.prototype */ {

  className: 'XM.ItemConversionTypeAssignment',

  /**
  @type XM.ItemConversion
  */
  itemConversion:  SC.Record.toOne('XM.ItemConversion'),

  /**
  @type XM.UnitType
  */
  unitType: SC.Record.toOne('XM.UnitType'),

});
