// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ToDoRecurrence
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ToDoRecurrence = {
  /** @scope XM.ToDoRecurrence.prototype */
  
  className: 'XM.ToDoRecurrence',

  

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
  period: SC.Record.attr(String),

  /**
    @type Number
  */
  frequency: SC.Record.attr(Number),

  /**
    @type Date
  */
  startDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  endDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Number
  */
  maximum: SC.Record.attr(Number)

};
