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
XM.OpportunityStage = XM.Record.extend(
/** @scope XM.OpportunityStage.prototype */ {

  className: 'XM.OpportunityStage',

  createPrivilege: 'MaintainOpportunityStages',
  readPrivilege:   'MaintainOpportunityStages',
  updatePrivilege: 'MaintainOpportunityStages',
  deletePrivilege: 'MaintainOpportunityStages',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  deactivate: SC.Record.attr(Boolean),

});
