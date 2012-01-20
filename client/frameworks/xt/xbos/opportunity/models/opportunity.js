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
  @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: YES
  }),
  
  /**
  @type XM.OpportunityStage
  */
  stage: SC.Record.toOne('XM.OpportunityStage'),
  
  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: YES
  }),
  
  /**
  @type String
  */
  name: SC.Record.att(String),
  
  /**
  @type XM.OpportunitySource
  */
  source: SC.Record.toOne('XM.OpportunitySource'),
  
  /**
  @type XM.OpportunityType
  */
  opportunityType: SC.Record.toOne('XM.OpportunityType'),
  
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
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type XM.Account
  */
  targetClose: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d'
  }),
  
  /**
  @type SC.DateTime
  */
  actualClose: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  completeDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type XM.OpportunityCharacteristic
  */
  characteristics: SC.Record.toMany('XM.OpportunityCharacteristic', {
    isNested: YES,
    inverse: 'opportunity'
  }),
  
  /**
  @type XM.OpportunityComment
  */
  comments: XM.Record.toMany('XM.OpportunityComment', {
    isNested: YES,
    inverse: 'opportunity'
  }),
  
  /**
  @type XM.OpportunityDocument
  */
  comments: XM.Record.toMany('XM.Opportunitydocument', {
    isNested: YES,
    inverse: 'opportunity'
  }),  

});
