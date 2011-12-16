// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  @extends XM.Record
*/

XM.IncidentResolution = XM.Record.extend(
/** @scope XM.IncidentResolution.prototype */ {

  className: 'XM.IncidentResolution',

  createPrivilege: 'MaintainIncidentResolutions',
  readPrivilege:   'MaintainIncidentResolutions',
  updatePrivilege: 'MaintainIncidentResolutions',
  deletePrivilege: 'MaintainIncidentResolutions',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Number
  */
  order: SC.Record.attr(Number),

});
