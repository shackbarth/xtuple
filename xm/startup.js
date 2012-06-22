
//new XT.StartupTaskManager();
//
//var t1 = new XT.StartupTask({taskName:"task1yo",task:function(){var self=this;setTimeout(function(){self.doComplete();},3000);}});
//var t2 = new XT.StartupTask({taskName:"task2yo",waitingList:["task3yo"],task:function(){var self=this;setTimeout(function(){self.doComplete();},2000);}});
//var t4 = new XT.StartupTask({taskName:"task3yo",waitingList:["task4yo"],task:function(){var self=this;setTimeout(function(){self.doComplete();},4000);}});
//var t5 = new XT.StartupTask({taskName:"task4yo",waitingList:["task1yo"],task:function(){var self=this;setTimeout(function(){self.doComplete();},1000);}});
//
//
//setTimeout(function() {
//  //debugger
//  XT.getStartupManager().start();
//},1000);


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
