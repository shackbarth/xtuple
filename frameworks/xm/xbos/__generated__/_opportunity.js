// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Opportunity = XM.Record.extend(
  /** @scope XM._Opportunity.prototype */ {
  
  className: 'XM.Opportunity',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllOpportunities",
      "read": "ViewAllOpportunities",
      "update": "MaintainAllOpportunities",
      "delete": "MaintainAllOpportunities"
    },
    "personal": {
      "create": "MaintainPersonalOpportunities",
      "read": "ViewPersonalOpportunities",
      "update": "MaintainPersonalOpportunities",
      "delete": "MaintainPersonalOpportunities",
      "properties": [
        "owner"
      ]
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.OpportunityStage
  */
  opportunityStage: SC.Record.toOne('XM.OpportunityStage'),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority'),

  /**
    @type XM.OpportunitySource
  */
  opportunitySource: SC.Record.toOne('XM.OpportunitySource'),

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
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  targetClose: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  actualClose: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.OpportunityComment
  */
  comments: SC.Record.toMany('XM.OpportunityComment', {
    isNested: true,
    inverse: 'opportunity'
  }),

  /**
    @type XM.OpportunityCharacteristic
  */
  characteristics: SC.Record.toMany('XM.OpportunityCharacteristic', {
    isNested: true,
    inverse: 'opportunity'
  }),

  /**
    @type XM.OpportunityContact
  */
  contacts: SC.Record.toMany('XM.OpportunityContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.OpportunityItem
  */
  items: SC.Record.toMany('XM.OpportunityItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.OpportunityFile
  */
  files: SC.Record.toMany('XM.OpportunityFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.OpportunityImage
  */
  images: SC.Record.toMany('XM.OpportunityImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.OpportunityUrl
  */
  urls: SC.Record.toMany('XM.OpportunityUrl', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.OpportunityOpportunity
  */
  opportunities: SC.Record.toMany('XM.OpportunityOpportunity', {
    isNested: true,
    inverse: 'source'
  })

});
