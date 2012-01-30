// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Alarm
  @version 0.1
*/

XM.IncidentAlarm = XM.Alarm.extend(
/** @scope XM.IncidentAlarm.prototype */ {

  /**
  @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident', {
    inverse:  'alarms',
    isMaster: NO,
  }),

});
