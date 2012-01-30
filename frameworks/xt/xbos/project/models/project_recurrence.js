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

XM.ProjectRecurrence = XM.Record.extend( XM.Recurrence,
/** @scope XM.ProjectRecurrence.prototype */ {

  className: 'XM.ProjectRecurrence',
  
  /** 
  @type XM.Project
  */
  project: SC.Record.toOne('XM.Project')

});
