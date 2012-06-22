
XT.StartupTask.create({
  taskName: "loadSessionObjects",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XT.session.loadSessionObjects(XT.session.ALL, options);
  }
});

XT.StartupTask.create({
  taskName: "loadPriorities",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.priorities = new XM.PriorityCollection();
    XM.priorities.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadCurrentUser",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete"),
      id: XT.session.details.username
    };
    XM.currentUser = new XM.UserAccountInfo();
    XM.currentUser.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadPriorities",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.priorities = new XM.PriorityCollection();
    XM.priorities.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadIncidentCategories",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.incidentCategories = new XM.IncidentCategoryCollection();
    XM.incidentCategories.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadIncidentResolutions",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.incidentResolutions = new XM.IncidentResolutionsCollection();
    XM.incidentResolutions.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadIncidentSeverities",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.incidentSeverities = new XM.IncidentSeverityCollection();
    XM.incidentSeverities.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadOpportunityStages",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.opportunityStages = new XM.OpportunityStageCollection();
    XM.opportunityStages.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadOpportunityTypes",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.opportunityTypes = new XM.OpportunityTypeCollection();
    XM.opportunityTypes.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});

XT.StartupTask.create({
  taskName: "loadOpportunitySources",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.opportunitySources = new XM.OpportunitySourceCollection();
    XM.opportunitySources.fetch(options);
  },
  waitingList: ["loadSessionObjects"]
});
