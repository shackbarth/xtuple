/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
    @name XM.Alarm
    @extends XM.Document
  */
  XM.Alarm = XM.Document.extend(/** @lends XM.Alarm# */{

    numberPolicy: XM.Document.AUTO_NUMBER,

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:offset change:qualifier change:time', this.alarmDidChange);
    },

    alarmDidChange: function (model, value, options) {
      var offset,
        qualifier,
        time,
        trigger;

      // Recalculate trigger time based on alarm settings
      offset = this.get('offset');
      qualifier = this.get('qualifier');
      time = this.get('time');
      trigger = this.get('trigger');
      if (offset) {
        switch (qualifier) {
        case 'MB':
        case 'MA':
          if (qualifier.indexOf('B') !== -1) {
            trigger.setMinutes(time.getMinutes() - offset);
          } else {
            trigger.setMinutes(time.getMinutes() + offset);
          }
          break;
        case 'HB':
        case 'HA':
          if (qualifier.indexOf('B') !== -1) {
            trigger.setHours(time.getHours() - offset);
          } else {
            trigger.setHours(time.getHours() + offset);
          }
          break;
        default:
          if (qualifier.indexOf('B') !== -1) {
            trigger.setDate(time.getDate() - offset);
          } else {
            trigger.setDate(time.getDate() + offset);
          }
          break;
        }
      } else {
        trigger.setMinutes(time.getMinutes());
      }
    }

  });

}());
