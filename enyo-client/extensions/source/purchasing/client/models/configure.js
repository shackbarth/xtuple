/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initSettings = function () {
    /**
     * @class XM.Purchasing
     * @extends XM.Settings
     */
    XM.Purchasing = XM.Settings.extend(
      /** @scope XM.Purchasing.Settings.prototype */ {

      recordType: "XM.Purchasing",

      privileges: "ConfigurePO"

    });

    XM.purchasing = new XM.Purchasing();
  };
})();

