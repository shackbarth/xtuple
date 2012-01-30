// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Substitute for Item.

  @extends XM.Record
*/

XM.ItemSubstitute = XM.Record.extend(
/** @scope XM.ItemSubstitute.prototype */ {

  className: 'XM.ItemSubstitute',

  /**
  @type XM.Item
  */
  rootItem: SC.Record.toOne('XM.Item', {
    inverse: 'substitutes',
    isMaster: NO,
  }),
  
  /**
  @type XM.Item
  */
  substituteItem: SC.Record.toOne('XM.ItemInfo', {
    isNested: YES
  }),
  
  /**
  @type Number
  */
  conversionRatio: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  ranking: SC.Record.attr(Number),

});

