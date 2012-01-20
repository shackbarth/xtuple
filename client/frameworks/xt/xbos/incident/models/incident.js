// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Activity
  @extends XM.Recurrence
  @version 0.1
*/

XM.Incident = XM.Activity.extend( XM.Recurrence,
/** @scope XM.Incident.prototype */ {

  className: 'XM.Incident',

  createPrivilege: 'MaintainPersonalIncidents MaintainAllIncidents'.w(),
  readPrivilege:   'ViewPersonalIncidents ViewAllIncidents',
  updatePrivilege: 'MaintainPersonalIncidents MaintainAllIncidents'.w(),
  deletePrivilege: 'MaintainPersonalIncidents MaintainAllIncidents'.w(),

  /**
  @type String
  */
  description: SC.Record.attr(String);

  /**
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account', {
    isNested: YES
  }),
  
  /**
  @type Boolean
  */
  isPublic: SC.Record.attr(Boolean),
  
  /**
  @type XM.IncidentCategory
  */
  category: SC.Record.toOne('XM.IncidentCategory'),
  
  /**
  @type XM.Status
  */
  incidentStatus: SC.Record.toOne('XM.Status'),
  
  /**
  @type XM.Priority
  */
  severity: SC.Record.toOne('XM.Priority'),
  
  /**
  @type XM.IncidentSevereity
  */
  severity: SC.Record.toOne('XM.IncidentSeverity'),
  
  /**
  @type XM.IncidentResolution
  */
  resolution: SC.Record.toOne('XM.IncidentResolution'),

  /**
  @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: YES,
  }),
  
  /**
  @type XM.IncidentHistory
  */
  history: SC.Record.toMany('XM.IncidentHistory', {
    isNested: YES,
    inverse: 'incident',
  }),
  
  /**
  @type XM.IncidentAlarm
  */
  alarms: SC.Record.toMany('XM.IncidentAlarm', {
    isNested: YES,
    inverse: 'incident'
  }),
  
  /**
  @type XM.IncidentCharacteristic
  */
  characteristics: SC.Record.toMany('XM.IncidentCharacteristic', {
    isNested: YES,
    inverse: 'incident'
  }),
  
  /**
  @type XM.IncidentComment
  */
  comments: XM.Record.toMany('XM.IncidentComment', {
    isNested: YES,
    inverse: 'incident'
  }),

  /****** CALCULATED PROPERTIES        */

  /**
  @field
  @type Boolean
  */
  isActive:  function() {
    var status = this.get('incidentStatus');
    if (status) { return status !== 'L'; }

    return NO;
  }.property('incidentStatus').cacheable()

});
