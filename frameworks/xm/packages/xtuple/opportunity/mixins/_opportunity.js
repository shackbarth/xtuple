// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Opportunity
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Opportunity = {
  /** @scope XM.Opportunity.prototype */
  
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
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true,
    isRequired: true,
    label: '_account'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_contact'.loc()
  }),

  /**
    @type XM.OpportunityStage
  */
  opportunityStage: SC.Record.toOne('XM.OpportunityStage', {
    label: '_opportunityStage'.loc()
  }),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority', {
    label: '_priority'.loc()
  }),

  /**
    @type XM.OpportunitySource
  */
  opportunitySource: SC.Record.toOne('XM.OpportunitySource', {
    label: '_opportunitySource'.loc()
  }),

  /**
    @type XM.OpportunityType
  */
  opportunityType: SC.Record.toOne('XM.OpportunityType', {
    label: '_opportunityType'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    defaultValue: function() {
      return XM.Currency.BASE;
    },
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  probability: SC.Record.attr(Number, {
    label: '_probability'.loc()
  }),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return SC.DateTime.create().toFormattedString('%Y-%m-%d');
    },
    label: '_startDate'.loc()
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_assignDate'.loc()
  }),

  /**
    @type Date
  */
  targetClose: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_targetClose'.loc()
  }),

  /**
    @type Date
  */
  actualClose: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_actualClose'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'owner');
        ret = '_loading'.loc();
      }
    },
    label: '_owner'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    label: '_assignedTo'.loc()
  }),

  /**
    @type XM.OpportunityComment
  */
  comments: SC.Record.toMany('XM.OpportunityComment', {
    isNested: true,
    inverse: 'opportunity',
    label: '_comments'.loc()
  }),

  /**
    @type XM.OpportunityCharacteristic
  */
  characteristics: SC.Record.toMany('XM.OpportunityCharacteristic', {
    isNested: true,
    inverse: 'opportunity',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.OpportunityContact
  */
  contacts: SC.Record.toMany('XM.OpportunityContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.OpportunityItem
  */
  items: SC.Record.toMany('XM.OpportunityItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.OpportunityFile
  */
  files: SC.Record.toMany('XM.OpportunityFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.OpportunityImage
  */
  images: SC.Record.toMany('XM.OpportunityImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.OpportunityUrl
  */
  urls: SC.Record.toMany('XM.OpportunityUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  }),

  /**
    @type XM.OpportunityAccount
  */
  accounts: SC.Record.toMany('XM.OpportunityAccount', {
    isNested: true,
    inverse: 'source',
    label: '_accounts'.loc()
  }),

  /**
    @type XM.OpportunityOpportunity
  */
  opportunities: SC.Record.toMany('XM.OpportunityOpportunity', {
    isNested: true,
    inverse: 'source',
    label: '_opportunities'.loc()
  })

};
