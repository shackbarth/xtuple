// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/core_documents');
sc_require('xbos/activity/models/activity');

/** @class

  (Document your Model here)

  @extends XM.Activity
  @version 0.1
*/

XM.Opportunity = XM.Activity.extend( XM.CoreDocuments, 
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
  name: SC.Record.attr(String),
  
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
  @type XM.DateTime
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
    
  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
  /**
  @type XM.OpportunityContact
  */
  contacts: SC.Record.toMany('XM.OpportunityContact', {
    isNested: YES
  }),
    
  /**
  @type XM.OpportunityItem
  */
  items: SC.Record.toMany('XM.OpportunityItem', {
    isNested: YES
  }),
  
  /**
  @type XM.OpportunityFile
  */
  files: SC.Record.toMany('XM.OpportunityFile', {
    isNested: YES
  }),
  
  /**
  @type XM.OpportunityImage
  */
  images: SC.Record.toMany('XM.OpportunityImage', {
    isNested: YES
  }),
  
  /**
  @type XM.OpportunityUrl
  */
  urls: SC.Record.toMany('XM.OpportunityUrl', {
    isNested: YES
  }),
  
  /**
  @type XM.OpportunityAssignment
  */
  opportunities: XM.Record.toMany('XM.OpportunityOpportunity', {
    isNested: YES
  }),
  
  /* @private */
  _opportunitiesLength: 0,
  
  /* @private */
  _opportunitiesLengthBinding: '.opportunities.length',
  
  /* @private */
  _opportunitiesDidChange: function() {
    var documents = this.get('documents'),
        opportunities = this.get('opportunities');

    documents.addEach(opportunities);    
  }.observes('opportunitiesLength') 

});
