// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple.
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.Alarm = XM.Record.extend(
/** @scope XM.Alarm.prototype */ {

  className: 'XM.Alarm',
  
  /**
  @type SC.DateTime
  */
  trigger: SC.Record.attr(SC.DateTime),
  
  /**
  @type SC.DateTime
  */
  time: SC.Record.attr(SC.DateTime),
  
  /**
  @type SC.DateTime
  */
  offset: SC.Record.attr(Number),
  
  /**
  @type String
  */
  qualifier: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  event: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  eventRecipient: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  email: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  emailRecipient: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  message: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  messageRecipient: SC.Record.attr(String),

}) ;
