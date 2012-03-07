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
XM._ToDo = XM.Record.extend(
  /** @scope XM._ToDo.prototype */ {
  
  className: 'XM.ToDo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllToDoItems",
      "read": "ViewAllToDoItems",
      "update": "MaintainAllToDoItems",
      "delete": "MaintainAllToDoItems"
    },
    "personal": {
      "create": "MaintainPersonalToDoItems",
      "read": "ViewPersonalToDoItems",
      "update": "MaintainPersonalToDoItems",
      "delete": "MaintainPersonalToDoItems",
      "properties": [
        "owner",
        "assignedTo"
      ]
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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  toDoStatus: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority'),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.ToDoAlarm
  */
  alarms: SC.Record.toMany('XM.ToDoAlarm', {
    isNested: true,
    inverse: 'to_do'
  }),

  /**
    @type XM.ToDoComment
  */
  comments: SC.Record.toMany('XM.ToDoComment', {
    isNested: true,
    inverse: 'to_do'
  }),

  /**
    @type XM.ToDoContact
  */
  contacts: SC.Record.toMany('XM.ToDoContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ToDoItem
  */
  items: SC.Record.toMany('XM.ToDoItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ToDoFile
  */
  files: SC.Record.toMany('XM.ToDoFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ToDoImage
  */
  images: SC.Record.toMany('XM.ToDoImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ToDoUrl
  */
  urls: SC.Record.toMany('XM.ToDoUrl', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ToDoToDo
  */
  toDos: SC.Record.toMany('XM.ToDoToDo', {
    isNested: true,
    inverse: 'source'
  })

});
