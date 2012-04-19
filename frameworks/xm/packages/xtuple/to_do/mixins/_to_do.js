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
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_contact'.loc()
  }),

  /**
    @type String
  */
  toDoStatus: SC.Record.attr(String, {
    defaultValue: 'N',
    label: '_toDoStatus'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_startDate'.loc()
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true,
    label: '_dueDate'.loc()
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_assignDate'.loc()
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_completeDate'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority', {
    label: '_priority'.loc()
  }),

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
    },
    label: '_owner'.loc()
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
    },
    label: '_assignedTo'.loc()
  }),

  /**
    @type XM.ToDoAlarm
  */
  alarms: SC.Record.toMany('XM.ToDoAlarm', {
    isNested: true,
    inverse: 'to_do',
    label: '_alarms'.loc()
  }),

  /**
    @type XM.ToDoComment
  */
  comments: SC.Record.toMany('XM.ToDoComment', {
    isNested: true,
    inverse: 'to_do',
    label: '_comments'.loc()
  }),

  /**
    @type XM.ToDoAccount
  */
  accounts: SC.Record.toMany('XM.ToDoAccount', {
    isNested: true,
    inverse: 'source',
    label: '_accounts'.loc()
  }),

  /**
    @type XM.ToDoContact
  */
  contacts: SC.Record.toMany('XM.ToDoContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.ToDoItem
  */
  items: SC.Record.toMany('XM.ToDoItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.ToDoFile
  */
  files: SC.Record.toMany('XM.ToDoFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.ToDoImage
  */
  images: SC.Record.toMany('XM.ToDoImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.ToDoUrl
  */
  urls: SC.Record.toMany('XM.ToDoUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  }),

  /**
    @type XM.ToDoToDo
  */
  toDos: SC.Record.toMany('XM.ToDoToDo', {
    isNested: true,
    inverse: 'source',
    label: '_toDos'.loc()
  })

};
