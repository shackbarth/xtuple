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
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account'),
  
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
  @type XM.IncidentSevereity
  */
  severity: SC.Record.toOne('XM.IncidentSeverity'),
  
  /**
  @type XM.IncidentResolution
  */
  resolution: SC.Record.toOne('XM.IncidentResolution'),

  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact'),
  
  /**
  @type XM.IncidentHistory
  */
  history: SC.Record.toMany('XM.IncidentHistory', {
    inverse: 'incident',
  }),
  
  /**
  @type XM.IncidentAlarm
  */
  alarms: SC.Record.toMany('XM.IncidentAlarm', {
    inverse: 'incident',
  }),
  
  /**
  @type XM.IncidentCharacteristic
  */
  characteristics: SC.Record.toMany('XM.IncidentCharacteristic', {
    inverse: 'incident',
  }),
  
  /**
  @type XM.IncidentComment
  */
  comments: XM.Record.toMany('XM.IncidentComment', {
    inverse: 'incident',
  }),

  /****** CALCULATED PROPERTIES        */

  /**
  @field
  @type Boolean
  */
  isActive:  function() {
    var stage = this.get('status');
    if (stage !== null) return stage !== 'L';

    return NO;
  }.property('stage').cacheable()

});
