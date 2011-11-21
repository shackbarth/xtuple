// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.1
*/

XM.Activity = XM.Document.extend(
/** @scope XM.Activity.prototype */ {

  className: 'XM.Activity',

  /** 
  @type String
  */
  name: SC.Record.attr(String),
  
  /** 
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),
  
  /** 
  @type XM.User
  */
  owner: SC.Record.toOne('XM.User'),
  
  /** 
  @type XM.User
  */
  assignedTo: SC.Record.toOne('XM.User'),
  
  /**
  @type XM.Priority
  */
  priority: SC.Record.attr('XM.Priority'),
  
  /**
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),
  
  /**
  @type SC.DateTime
  */
  dueDate: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),
  
  /**
  @type SC.DateTime
  */
  assignDate: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),
  
  /**
  @type SC.DateTime
  */
  completeDate: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String)

});
