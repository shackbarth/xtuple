// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Cost for Item.

  @extends XM.Record
*/
XM.ItemCost = XM.Record.extend(
/** @scope XM.ItemCost.prototype */ {

  className: 'XM.ItemCost',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse: 'costs',
    isMaster: NO,
  }),
  
  /**
  @type XM.CostElement
  */
  costElement: SC.Record.toOne('XM.CostElement', {
    inverse: 'costs',
    isMaster: NO,
  }),
  
   /**
  @type Boolean 
  */
  lowerlevel: SC.Record.attr(Boolean),
  
   /**
  @type Boolean 
  */
  isPostStandard: SC.Record.attr(Boolean),
  
   /**
  @type Number
  */
  standardCost: SC.Record.attr(Number),
  
  /**
  @type SC.DateTime
  */
  posted: SC.Record.attr(SC.DateTime, {
    /** @private */
    defaultValue: function() {
      return (arguments[0].get('status') === SC.Record.READY_NEW) ? SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601) : null;
    }
  }),
  
  /**
  @type Number
  */
  actualCost: SC.Record.attr(Number),
  
  /**
  @type SC.DateTime
  */
  updated: SC.Record.attr(SC.DateTime, {
    /** @private */
    defaultValue: function() {
      return (arguments[0].get('status') === SC.Record.READY_NEW) ? SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601) : null;
    }
  }),

  /**
  @type Number
  */
  currency: SC.Record.attr(Number),

});

