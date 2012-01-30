// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  @extends XM.Record
*/

XM.IncidentSeverity = XM.Record.extend(
/** @scope XM.IncidentSeverity.prototype */ {

  className: 'XM.IncidentSeverity',

  createPrivilege: 'MaintainIncidentSeverities',
  readPrivilege:   'MaintainIncidentSeverities',
  updatePrivilege: 'MaintainIncidentSeverities',
  deletePrivilege: 'MaintainIncidentSeverities',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type String
  */
  order: SC.Record.attr(Number),

});
