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
XM._Incident = XM.Record.extend(
  /** @scope XM._Incident.prototype */ {
  
  className: 'XM.Incident',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllIncidents",
      "read": "ViewAllIncidents",
      "update": "MaintainAllIncidents",
      "delete": "MaintainAllIncidents"
    },
    "personal": {
      "create": "MaintainPersonalIncidents",
      "read": "ViewPersonalIncidents",
      "update": "MaintainPersonalIncidents",
      "delete": "MaintainPersonalIncidents",
      "properties": [
        "owner",
        "assignedTo"
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
    @type Number
  */
  number: SC.Record.attr(Number),

  /**
    @type String
  */
  description: SC.Record.attr(String),

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
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority'),

  /**
    @type String
  */
  incidentStatus: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isPublic: SC.Record.attr(Boolean),

  /**
    @type XM.IncidentResolution
  */
  resolution: SC.Record.toOne('XM.IncidentResolution'),

  /**
    @type XM.IncidentSeverity
  */
  severity: SC.Record.toOne('XM.IncidentSeverity'),

  /**
    @type XM.IncidentAlarm
  */
  alarms: SC.Record.toMany('XM.IncidentAlarm', {
    isNested: true,
    inverse: 'incident'
  }),

  /**
    @type XM.IncidentHistory
  */
  history: SC.Record.toMany('XM.IncidentHistory', {
    isNested: true,
    inverse: 'incident'
  }),

  /**
    @type XM.IncidentComment
  */
  comments: SC.Record.toMany('XM.IncidentComment', {
    isNested: true,
    inverse: 'incident'
  }),

  /**
    @type XM.IncidentCharacteristic
  */
  characteristics: SC.Record.toMany('XM.IncidentCharacteristic', {
    isNested: true,
    inverse: 'incident'
  }),

  /**
    @type XM.IncidentContact
  */
  contacts: SC.Record.toMany('XM.IncidentContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentItem
  */
  items: SC.Record.toMany('XM.IncidentItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentFile
  */
  files: SC.Record.toMany('XM.IncidentFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentImage
  */
  images: SC.Record.toMany('XM.IncidentImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentUrl
  */
  urls: SC.Record.toMany('XM.IncidentUrl', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentAccount
  */
  accounts: SC.Record.toMany('XM.IncidentAccount', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.IncidentIncident
  */
  incidents: SC.Record.toMany('XM.IncidentIncident', {
    isNested: true,
    inverse: 'source'
  })

});
