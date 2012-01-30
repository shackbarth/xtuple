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
XM.OpportunityType = XM.Record.extend(
/** @scope XM.OpportunityType.prototype */ {

  className: 'XM.OpportunityType',

  createPrivilege: 'MaintainOpportunityTypes',
  readPrivilege:   'MaintainOpportunityTypes',
  updatePrivilege: 'MaintainOpportunityTypes',
  deletePrivilege: 'MaintainOpportunityTypes',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

});
