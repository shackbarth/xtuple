// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Activity
  @version 0.1
*/
XM.ToDo = XM.Activity.extend( XM.Recurrence, XM.CoreDocuments,
/** @scope XM.ToDo.prototype */ {

  className: 'XM.ToDo',
  
  nestedRecordNamespace: XM,

  createPrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),
  readPrivilege:   'ViewPersonalToDoItems ViewAllToDoItems',
  updatePrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),
  deletePrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),

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
    isNested: YES
  }),
  
  /**
  @type String
  */
  toDoStatus: SC.Record.attr(String, {
    /** @private */
    defaultValue: function() {
      return XM.ToDo.NEITHER
    }
  }),
  
  /**
  @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority'),
  
  /**
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  dueDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  assignDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  completeDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
    
  /**
  @type XM.ToDoAlarm
  */
  alarms: SC.Record.toMany('XM.ToDoAlarm', { 
    isNested: YES,
    inverse: 'toDo'
  }),
  
  /**
  @type XM.ToDoComment
  */
  comments: XM.Record.toMany('XM.ToDoComment', { 
    isNested: YES,
    inverse: 'toDo'
  }),
  
  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
  /**
  @type XM.ToDoContact
  */
  contacts: SC.Record.toMany('XM.ToDoContact', {
    isNested: YES
  }),
    
  /**
  @type XM.ToDoItem
  */
  items: SC.Record.toMany('XM.ToDoItem', {
    isNested: YES
  }),
  
  /**
  @type XM.ToDoFile
  */
  files: SC.Record.toMany('XM.ToDoFile', {
    isNested: YES
  }),
  
  /**
  @type XM.ToDoImage
  */
  images: SC.Record.toMany('XM.ToDoImage', {
    isNested: YES
  }),
  
  /**
  @type XM.ToDoUrl
  */
  urls: SC.Record.toMany('XM.ToDoUrl', {
    isNested: YES
  }),
  
  /**
  @type XM.ToDoToDo
  */
  toDos: XM.Record.toMany('XM.ToDoToDo', {
    isNested: YES
  }),
  
  /* @private */
  _toDosLength: 0,
  
  /* @private */
  _toDosLengthBinding: '.toDos.length',
  
  /* @private */
  _toDosDidChange: function() {
    var documents = this.get('documents'),
        toDos = this.get('toDos');

    documents.addEach(toDos);    
  }.observes('toDosLength')
  
});


XM.ToDo.mixin( /** @scope XM.ToDo */ {

/**
  Pending status for To-Do.
  
  @static
  @constant
  @type String
  @default P
*/
  PENDING: 'P',

/**
  Deffered status for To-Do.
  
  @static
  @constant
  @type String
  @default O
*/
  DEFERRED: 'D',

/**
  Open status for To-Do. Neither Pending or Deferred.
  @static
  @constant
  @type String
  @default N
*/
  NEITHER: 'N',

/**
  Completed status for To-Do.
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'

});

