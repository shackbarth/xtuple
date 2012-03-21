// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Incident
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Incident = {
  /** @scope XM.Incident.prototype */
  
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
  number: SC.Record.attr(Number, {
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    isRequired: true,
    label: '_description'.loc()
  }),

  /**
    @type Boolean
  */
  isPublic: SC.Record.attr(Boolean, {
    label: '_isPublic'.loc()
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
    isRequired: true,
    label: '_contact'.loc()
  }),

  /**
    @type XM.Priority
  */
  priority: SC.Record.toOne('XM.Priority', {
    label: '_priority'.loc()
  }),

  /**
    @type String
  */
  incidentStatus: SC.Record.attr(String, {
    defaultValue: 'N',
    label: '_incidentStatus'.loc()
  }),

  /**
    @type XM.IncidentResolution
  */
  resolution: SC.Record.toOne('XM.IncidentResolution', {
    label: '_resolution'.loc()
  }),

  /**
    @type XM.IncidentSeverity
  */
  severity: SC.Record.toOne('XM.IncidentSeverity', {
    label: '_severity'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.dataSource.session.userName;
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
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true,
    label: '_item'.loc()
  }),

  /**
    @type XM.IncidentRecurrence
  */
  recurring: SC.Record.toMany('XM.IncidentRecurrence', {
    isNested: true,
    inverse: 'incident',
    label: '_recurring'.loc()
  }),

  /**
    @type XM.IncidentAlarm
  */
  alarms: SC.Record.toMany('XM.IncidentAlarm', {
    isNested: true,
    inverse: 'incident',
    label: '_alarms'.loc()
  }),

  /**
    @type XM.IncidentHistory
  */
  history: SC.Record.toMany('XM.IncidentHistory', {
    isNested: true,
    inverse: 'incident',
    label: '_history'.loc()
  }),

  /**
    @type XM.IncidentComment
  */
  comments: SC.Record.toMany('XM.IncidentComment', {
    isNested: true,
    inverse: 'incident',
    label: '_comments'.loc()
  }),

  /**
    @type XM.IncidentCharacteristic
  */
  characteristics: SC.Record.toMany('XM.IncidentCharacteristic', {
    isNested: true,
    inverse: 'incident',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.IncidentContact
  */
  contacts: SC.Record.toMany('XM.IncidentContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.IncidentItem
  */
  items: SC.Record.toMany('XM.IncidentItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.IncidentFile
  */
  files: SC.Record.toMany('XM.IncidentFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.IncidentImage
  */
  images: SC.Record.toMany('XM.IncidentImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.IncidentUrl
  */
  urls: SC.Record.toMany('XM.IncidentUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  }),

  /**
    @type XM.IncidentAccount
  */
  accounts: SC.Record.toMany('XM.IncidentAccount', {
    isNested: true,
    inverse: 'source',
    label: '_accounts'.loc()
  }),

  /**
    @type XM.IncidentIncident
  */
  incidents: SC.Record.toMany('XM.IncidentIncident', {
    isNested: true,
    inverse: 'source',
    label: '_incidents'.loc()
  })

};
