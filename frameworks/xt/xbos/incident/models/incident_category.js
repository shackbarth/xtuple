// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/
XM.IncidentCategory = XM.Record.extend(
/** @scope XM.IncidentCategory.prototype */ {

  className: 'XM.IncidentCategory',

  createPrivilege: 'MaintainIncidentCategories',
  readPrivilege:   'MaintainIncidentCategories',
  updatePrivilege: 'MaintainIncidentCategories',
  deletePrivilege: 'MaintainIncidentCategories',

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
