// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XT.Record
*/

XM.Alarm = XM.Document.extend(
/** @scope XM.Alarm.prototype */ {

  /**
    Walk like a duck.
  */
  isAlarm: true,

  /**
    Auto-generated number from server.
  */
  numberPolicy: XM.AUTO_NUMBER,
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  // ..........................................................
  // METHODS
  //

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.calculateTrigger();
  },

  calculateTrigger: function() {
    var alarmOffset = this.get('offset'), 
        alarmQualifier = this.get('qualifier'), 
        alarmTime = this.get('time');

    if(alarmOffset > 0) {
      switch(alarmQualifier) {
        case 'MB':
        case 'MA':
          if(alarmQualifier.indexOf('B') !== -1) {
            this.set('trigger', alarmTime.advance({minute: - alarmOffset}));
debugger;
          } else this.set('trigger', alarmTime.advance({minute: + alarmOffset}));
          break;
        case 'HB':
        case 'HA':
          if(alarmQualifier.indexOf('B') !== -1) {
            this.set('trigger', alarmTime.advance({hour: - alarmOffset}));
          } else this.set('trigger', alarmTime.advance({hour: + alarmOffset}));
          break;
        default:
          if(alarmQualifier.indexOf('B') !== -1) {
            this.set('trigger', alarmTime.advance({day: - alarmOffset}));
          } else this.set('trigger', alarmTime.advance({day: + alarmOffset}));
          break;
      }
    } else {
      this.set('trigger', alarmTime);
    }
  },

  // ..........................................................
  // OBSERVERS
  //

  triggerCriteriaDidChange: function() {
    this.calculateTrigger();
  }.observes('offset', 'qualifier', 'time')
});
