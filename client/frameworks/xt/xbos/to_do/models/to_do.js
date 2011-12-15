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
XM.ToDo = XM.Activity.extend( XM.Recurrence,
/** @scope XM.ToDo.prototype */ {

  className: 'XM.ToDo',

  createPrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),
  readPrivilege:   'ViewPersonalToDoItems ViewAllToDoItems',
  updatePrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),
  deletePrivilege: 'MaintainPersonalToDoItems MaintainAllToDoItems'.w(),

  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact'),
  
  /**
  @type String
  */
  toDoStatus: SC.Record.attr(String, {
    /** @private */
    defaultValue: XM.ToDo.NEITHER,
  }),
    
  /**
  @type XM.ToDoAlarm
  */
  alarms: SC.Record.toMany('XM.ToDoAlarm', { 
    inverse: 'toDo' ,
  }),
  
  /**
  @type XM.ToDoComment
  */
  comments: XM.Record.toMany('XM.ToDoComment', { 
    inverse: 'toDo' ,
  }),

});

/**
  Pending status for To-Do.
  
  @static
  @constant
  @type String
  @default P
*/
XM.ToDo.PENDING = 'P';

/**
  Deffered status for To-Do.
  
  @static
  @constant
  @type String
  @default O
*/
XM.ToDo.DEFERRED = 'D';

/**
  Open status for To-Do. Neither Pending or Deferred.
  @static
  @constant
  @type String
  @default N
*/
XM.ToDo.NEITHER = 'N';

/**
  Completed status for To-Do.
  @static
  @constant
  @type String
  @default C
*/
XM.ToDo.COMPLETED = 'C';
