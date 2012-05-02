// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ToDo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ToDo = {
  /** @scope XM.ToDo.prototype */
  
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
  name: SC.Record.attr(String, {
    isRequired: true
  }),

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
  toDoStatus: SC.Record.attr(String, {
    defaultValue: 'N'
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

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
  dueDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
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
    isNested: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'owner');
        ret = '_loading'.loc();
      }
    }
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    isRequired: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'assignedTo');
        ret = '_loading'.loc();
      }
    }
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
    @type XM.ToDoAccount
  */
  accounts: SC.Record.toMany('XM.ToDoAccount', {
    isNested: true,
    inverse: 'source'
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

};
