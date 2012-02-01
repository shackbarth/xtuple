// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.OpportunityInfo = XM.Record.extend(
/** @scope XM.OpportunityInfo.prototype */ {

  className: 'XM.OpportunityInfo',

  isEditable: NO,

  /**
  @type String
  */
  number: SC.Record.attr(String),

  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean)

});
