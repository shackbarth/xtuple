// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.OpportunityInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._OpportunityInfo = {
  /** @scope XM.OpportunityInfo.prototype */
  
  className: 'XM.OpportunityInfo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAllOpportunities",
      "update": false,
      "delete": false
    },
    "personal": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false,
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
    @type Date
  */
  targetClose: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type XM.OpportunityStage
  */
  opportunityStage: SC.Record.toOne('XM.OpportunityStage'),

  /**
    @type XM.OpportunityType
  */
  opportunityType: SC.Record.toOne('XM.OpportunityType'),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority'),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  })

};
