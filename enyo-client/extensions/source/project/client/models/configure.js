/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true, strict:false*/
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

      recordType: "XM.ProjectManagement",
      privileges: true,

      handlers: {
        "change:UseProjects": "useProjectsChanged"
      },

      useProjectsChanged: function () {
        var useProjects = this.get("UseProjects");
        if (!useProjects) {
          this.set("RequireProjectAssignment", false);
        }
      }

    });

    XM.projectManagement = new XM.ProjectManagement();
  };
})();

