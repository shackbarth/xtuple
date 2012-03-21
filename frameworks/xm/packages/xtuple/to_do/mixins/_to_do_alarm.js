// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ToDoAlarm
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ToDoAlarm = {
  /** @scope XM.ToDoAlarm.prototype */
  
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
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type XM.ToDo
  */
  toDo: SC.Record.toOne('XM.ToDo', {
    label: '_toDo'.loc()
  }),

  /**
    @type Boolean
  */
  email: SC.Record.attr(Boolean, {
    label: '_email'.loc()
  }),

  /**
    @type String
  */
  emailRecipient: SC.Record.attr(String, {
    label: '_emailRecipient'.loc()
  }),

  /**
    @type Boolean
  */
  event: SC.Record.attr(Boolean, {
    label: '_event'.loc()
  }),

  /**
    @type String
  */
  eventRecipient: SC.Record.attr(String, {
    label: '_eventRecipient'.loc()
  }),

  /**
    @type Boolean
  */
  message: SC.Record.attr(Boolean, {
    label: '_message'.loc()
  }),

  /**
    @type String
  */
  messageRecipient: SC.Record.attr(String, {
    label: '_messageRecipient'.loc()
  }),

  /**
    @type Number
  */
  offset: SC.Record.attr(Number, {
    label: '_offset'.loc()
  }),

  /**
    @type String
  */
  qualifier: SC.Record.attr(String, {
    label: '_qualifier'.loc()
  }),

  /**
    @type Date
  */
  time: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_time'.loc()
  }),

  /**
    @type Date
  */
  trigger: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_trigger'.loc()
  })

};
