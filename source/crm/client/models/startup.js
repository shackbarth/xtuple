/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initStartup = function () {
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
    
    XT.StartupTasks.push({
      taskName: "loadIncidentCategories",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.incidentCategories = new XM.IncidentCategoryCollection();
        XM.incidentCategories.fetch(options);
      }
    });

    XT.StartupTasks.push({
      taskName: "loadIncidentResolutions",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.incidentResolutions = new XM.IncidentResolutionCollection();
        XM.incidentResolutions.fetch(options);
      }
    });
    
    XT.StartupTasks.push({
      taskName: "loadIncidentSeverities",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.incidentSeverities = new XM.IncidentSeverityCollection();
        XM.incidentSeverities.fetch(options);
      }
    });

    XT.StartupTasks.push({
      taskName: "loadOpportunityStages",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.opportunityStages = new XM.OpportunityStageCollection();
        XM.opportunityStages.fetch(options);
      }
    });

    XT.StartupTasks.push({
      taskName: "loadOpportunityTypes",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.opportunityTypes = new XM.OpportunityTypeCollection();
        XM.opportunityTypes.fetch(options);
      }
    });

    XT.StartupTasks.push({
      taskName: "loadOpportunitySources",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.opportunitySources = new XM.OpportunitySourceCollection();
        XM.opportunitySources.fetch(options);
      }
    });
  };

}());
