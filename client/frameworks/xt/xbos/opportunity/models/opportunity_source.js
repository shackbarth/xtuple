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
XM.OpportunitySource = XM.Record.extend(
/** @scope XM.OpportunitySource.prototype */ {

  className: 'XM.OpportunitySource',

  createPrivilege: 'MaintainOpportunitySources',
  readPrivilege:   'MaintainOpportunitySources',
  updatePrivilege: 'MaintainOpportunitySources',
  deletePrivilege: 'MaintainOpportunitySources',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

});
