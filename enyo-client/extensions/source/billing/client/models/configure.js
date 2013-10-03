/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.billing.initSettings = function () {
    /**
     * @class XM.Billing
     * @extends XM.Settings
     */
    XM.Billing = XM.Settings.extend(
      /** @scope XM.Billing.Settings.prototype */ {

      recordType: 'XM.Billing',
      privileges: 'ConfigureAR',

      bindEvents: function () {
        XM.Settings.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },
    });
    
    XM.billing = new XM.Billing();
  };
})();

