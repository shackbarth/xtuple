// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
sc_require('models/activity/activity');
/** @class

  (Document your Model here)

  @extends XM.Activity
  @version 0.1
*/

XM.Opportunity = XM.Activity.extend(
/** @scope XM.Opportunity.prototype */ {

  className: 'XM.Opportunity',

  createPrivilege: 'MaintainPersonalOpportunities MaintainAllOpportunities'.w(),
  readPrivilege:   'ViewPersonalOpportunities ViewAllOpportunities',
  updatePrivilege: 'MaintainPersonalOpportunities MaintainAllOpportunities'.w(),
  deletePrivilege: 'MaintainPersonalOpportunities MaintainAllOpportunities'.w(),

  /**
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account'),
  
  /**
  @type XM.OpportunityStage
  */
  stage: SC.Record.toOne('XM.OpportunityStage'),
  
  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact'),
  
  /**
  @type XM.OpportunitySource
  */
  source: SC.Record.toOne('XM.OpportunitySource'),
  
  /**
  @type XM.OpportunityType
  */
  type: SC.Record.toOne('XM.OpportunityType'),
  
  /**
  @type Number
  */
  amount: SC.Record.attr(Number),
  
  /**
  @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),
  
  /**
  @type Number
  */
  probability: SC.Record.attr(Number),
  
  /**
  @type Characteristics
  */
  characteristics: SC.Record.toMany('XM.OpportunityCharacteristic', {
    inverse: 'opportunity',
  }),
  
  /**
  @type XM.Comment
  */
  comments: XM.Record.toMany('XM.OpportunityComment', {
    inverse: 'opportunity',
  }),

});
