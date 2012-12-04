/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.admin.initStartup = function () {
    XT.StartupTasks.push({
      taskName: "loadDatabaseServers",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.databaseServers = new XM.DatabaseServerCollection();
        XM.databaseServers.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadOrganizations",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.organizations = new XM.OrganizationCollection();
        XM.organizations.fetch(options);
      }
    });
  };

}());
