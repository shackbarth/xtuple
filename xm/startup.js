
XT.StartupTask.create({
  taskName: "loadSessionSettings",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XT.session.loadSessionObjects(XT.session.SETTINGS, options);
  }
});

XT.StartupTask.create({
  taskName: "loadSessionPrivileges",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XT.session.loadSessionObjects(XT.session.PRIVILEGES, options);
  }
});

XT.StartupTask.create({
  taskName: "loadSessionSchema",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XT.session.loadSessionObjects(XT.session.SCHEMA, options);
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCurrencies",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.currencies = new XM.CurrencyCollection();
    XM.currencies.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadCountries",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.countries = new XM.CountryCollection();
    XM.countries.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});


XT.StartupTask.create({
  taskName: "loadStates",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.states = new XM.StateCollection();
    XM.states.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});

XT.StartupTask.create({
  taskName: "loadIncidentResolutions",
  task: function() {
    var options = {
      success: enyo.bind(this, "didComplete")
    };
    XM.incidentResolutions = new XM.IncidentResolutionCollection();
    XM.incidentResolutions.fetch(options);
  },
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
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
  waitingList: ["loadSessionSettings","loadSessionSchema","loadSessionPrivileges"]
});
