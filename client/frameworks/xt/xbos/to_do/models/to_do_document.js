// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
*/
XM.ToDoDocument = XM.DocumentAssignment.extend(
/** @scope XM.ToDoDocument.prototype */ {

  className: 'XM.ToDoDocument',

  /**
  @type XM.ToDo
  */
  toDo: SC.Record.toOne('XM.ToDo', {
    inverse:  'documents',
    isMaster: NO,
  })
  
}) ;
