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
      }

    });

    XM.billing = new XM.Billing();
  };
})();

