/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.incidentPlus.initStartup = function () {
    XT.StartupTasks.push({
      taskName: "loadProjectVersions",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.projectVersions = new XM.ProjectVersionCollection();
        XM.projectVersions.fetch(options);
      }
    });
  };

}());
