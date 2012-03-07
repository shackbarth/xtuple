// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ToDoAlarm = XM.Record.extend(
  /** @scope XM._ToDoAlarm.prototype */ {
  
  className: 'XM.ToDoAlarm',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.ToDo
  */
  toDo: SC.Record.toOne('XM.ToDo'),

  /**
    @type String
  */
  number: SC.Record.attr(String),

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
  event: SC.Record.attr(Boolean),

  /**
    @type String
  */
  eventRecipient: SC.Record.attr(String),

  /**
    @type Boolean
  */
  message: SC.Record.attr(Boolean),

  /**
    @type String
  */
  messageRecipient: SC.Record.attr(String),

  /**
    @type Number
  */
  offset: SC.Record.attr(Number),

  /**
    @type String
  */
  qualifier: SC.Record.attr(String),

  /**
    @type Date
  */
  time: SC.Record.attr(Date),

  /**
    @type Date
  */
  trigger: SC.Record.attr(Date)

});
