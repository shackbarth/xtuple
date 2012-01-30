// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Conversion for Item.

  @extends XM.Record
*/

XM.ItemConversion = XM.UnitConversion.extend(
/** @scope XM.ItemConversion.prototype */ {

  className: 'XM.ItemConversion',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse: 'conversions',
    isMaster: NO,
  }),

});

