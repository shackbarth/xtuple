/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.connect.initStartup = function () {
    XT.StartupTasks.push({
      taskName: "loadIncidentEmailProfiles",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.incidentEmailProfiles = new XM.IncidentEmailProfileCollection();
        XM.incidentEmailProfiles.fetch(options);
      }
    });
  };

}());
