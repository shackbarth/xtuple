/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Crm = XM.Settings.extend(
      /** @scope XM.Crm.Settings.prototype */ {

      recordType: 'XM.Crm',
      
      privileges: 'ConfigureCRM'

    });

  };

}());
