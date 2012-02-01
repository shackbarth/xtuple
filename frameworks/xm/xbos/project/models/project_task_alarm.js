// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Alarm
  @version 0.1
*/

XM.ProjectTaskAlarm = XM.Alarm.extend(
/** @scope XM.ProjectTaskAlarm.prototype */ {

  className: 'ProjectTaskAlarm',
  
  /**
  @type XM.ProjectTask
  */
  projectTask: SC.Record.toOne('XM.ProjectTask', {
    inverse:  'alarms',
    isMaster: NO,
  }),

});
