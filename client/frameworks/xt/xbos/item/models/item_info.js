// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Item.

  @extends XM.Record
*/
XM.ItemInfo = XM.Record.extend(
/** @scope XM.ItemInfo.prototype */ {

  className: 'XM.ItemInfo',
  
  nestedRecordNamespace: XM,
  
  isEditable: NO,
  
  /**
  @type String
  */
  number: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),
  
  /**
  @type XM.Unit
  */
  inventoryUnit: SC.Record.toOne('XM.Unit'),
  
  /**
  @type String
  */
  description1: SC.Record.attr(String),
  
  /**
  @type String
  */
  description2: SC.Record.attr(String),
  

});

