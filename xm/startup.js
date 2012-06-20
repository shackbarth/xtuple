// Session
XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XT.session.loadSessionObjects(XT.session.ALL, options);
});

XT.StartupTask.addTask(function() {
  var options = {};
  options.id = XT.session.details.username;
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.currentUser = new XM.UserAccountInfo();
  XM.currentUser.fetch(options);
});

// Crm
XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.priorities = new XM.PriorityCollection();
  XM.priorities.fetch(options);
});

// Incident
XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.incidentCategories = new XM.IncidentCategoryCollection();
  XM.incidentCategories.fetch(options);
});

XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.incidentResolutions = new XM.IncidentResolutionCollection();
  XM.incidentResolutions.fetch(options);
});

XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.incidentSeverities = new XM.IncidentSeverityCollection();
  XM.incidentSeverities.fetch(options);
});

// Opportunity
XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.opportunityStages = new XM.OpportunityStageCollection();
  XM.opportunityStages.fetch(options);
});

XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.opportunityTypes = new XM.OpportunityTypeCollection();
  XM.opportunityTypes.fetch(options);
});

XT.StartupTask.addTask(function() {
  var options = {};
  options.success = function() {
    XT.StartupTask.taskComplete();
  };
  XM.opportunitySources = new XM.OpportunitySourceCollection();
  XM.opportunitySources.fetch(options);
});
