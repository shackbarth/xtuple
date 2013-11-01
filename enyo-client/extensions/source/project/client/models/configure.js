/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initSettings = function () {
    /**
     * @class XM.ProjectManagement
     * @extends XM.Settings
     */
    XM.ProjectManagement = XM.Settings.extend(
      /** @scope XM.ProjectManagement.Settings.prototype */ {

      recordType: 'XM.ProjectManagement',
      privileges: true,

      bindEvents: function () {
        XM.Settings.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      }

    });

    XM.projectManagement = new XM.ProjectManagement();
  };
})();

