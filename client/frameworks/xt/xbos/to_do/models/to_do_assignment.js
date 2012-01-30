// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.ToDoAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.ToDoAssignment.prototype */ {

  className: 'XM.ToDoAssignment',
  
  /** 
  @type XM.ToDoInfo
  */
  project: SC.Record.toOne('XM.ToDoInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
