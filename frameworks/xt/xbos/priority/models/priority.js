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

XM.Priority = XM.Record.extend(
/** @scope XM.Priority.prototype */ {

  className: 'XM.Priority',

  createPrivilege: 'MaintainIncidentPriorities',
  readPrivilege:   'MaintainIncidentPriorities',
  updatePrivilege: 'MaintainIncidentPriorities',
  deletePrivilege: 'MaintainIncidentPriorities',

  /**
  @type String
  */
  name:        SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Number
  */
  order:       SC.Record.attr(Number),

}) ;
