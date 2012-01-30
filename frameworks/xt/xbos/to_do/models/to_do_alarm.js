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
XM.ToDoAlarm = XM.Alarm.extend(
/** @scope XM.ToDoAlarm.prototype */ {

  className: 'XM.ToDoAlarm',
  
  /**
  @type XM.ToDo
  */
  toDo: SC.Record.toOne('XM.ToDo', {
    inverse:  'alarms',
    isMaster: NO,
  }),
  
});
