// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  Alias for Item.

  @extends XM.Record
*/
XM.ItemAlias = XM.Record.extend(
/** @scope XM.ItemAlias.prototype */ {

  className: 'XM.ItemAlias',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse: 'aliases',
    isMaster: NO,
  }),
  
  /**
  @type String
  */
  number: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  useDescription: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  description1: SC.Record.attr(String),
  
  /**
  @type String
  */
  description2: SC.Record.attr(String),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String),

});

