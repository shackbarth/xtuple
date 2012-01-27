// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.ToDoRecurrence = XM.Record.extend( XM.Recurrence,
/** @scope XM.ToDoRecurrence.prototype */ {

  className: 'XM.ToDoRecurrence',
  
  /** 
  @type XM.ToDo
  */
  toDo: SC.Record.toOne('XM.ToDo')

});
