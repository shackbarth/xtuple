// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project');


/**
  @class

  @extends XM.Document
  @extends XM.CoreDocuments
*/
XM.Project = XM.Document.extend(XM._Project, XM.CoreDocuments, 
 /** @scope XM.Project.prototype */ {
 /**
    To-Do as of 03/31/2012
		1A = ORM - CRM Account and Contact should be added as standard associations for Project (Add to Parent of Project)
		(Done) 3C = Observes - The assigned date should automatically populate on a Project or Project Task when the document is assigned
		           Status is In-Process[ O ] - look at mixin
		(Done) 4D = Observes - The completed date should automatically populate on a Project or Project Task when the document status is changed to completed
		5E = Project and Project Task should be modified to be able to keep track of date changes by whom and when (Handle by db check it)
		6F = Method - Add the ability to copy Projects
		   6F1 = ORM add New Item Number and Off-set number
		(Done) 7G = Observes - balanceHours subtract calc
		(Done) 8H = Observes - balanceExpenses subtract calc
		9I = Project task on save show zero in plan if not set 0.0000
		
 */
	
	summaryBudgetedHours: 0,
   
	summaryActualHours: 0,
	 
	budgetedExpenses: 0,
  
	actualExpenses: 0,
  
	// .................................................
  // CALCULATED PROPERTIES
  //
  
	number: SC.Record.attr(Number, {
    toType: function(record, key, value) {
      if(value) return value.toUpperCase();
    }
  }),
	
  //..................................................
  // METHODS
  //
	
  updateBudgetedHours: function() {
    var tasks = this.get('tasks'),
        budHours = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = status & SC.Record.DESTROYED ? 0 : task.get('budgetedHours');
      budHours = budHours + hours;
    }
    this.setIfChanged('summaryBudgetedHours', SC.Math.round(budHours, XT.QTY_SCALE));
  },	
	
  updateActualHours: function() {
    var tasks = this.get('tasks'),
        actHours = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = status & SC.Record.DESTROYED ? 0 : task.get('actualHours');
      actHours = actHours + hours;
    }
    this.setIfChanged('summaryActualHours', SC.Math.round(actHours, XT.QTY_SCALE));
  },	
	
  updateBudgetedExpenses: function() {
    var tasks = this.get('tasks'),
        budExpenses = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = status & SC.Record.DESTROYED ? 0 : task.get('budgetedExpenses');
      budExpenses = budExpenses + expenses;
    }
    this.setIfChanged('summaryBudgetedExpenses', SC.Math.round(budExpenses, XT.MONEY_SCALE));
  },	
	
  updateActualExpenses: function() {
    var tasks = this.get('tasks'),
        actExpenses = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = status & SC.Record.DESTROYED ? 0 : task.get('actualExpenses');
      actExpenses = actExpenses + expenses;
    }
    this.setIfChanged('summaryActualExpenses', SC.Math.round(actExpenses, XT.MONEY_SCALE));
  },	

  //..................................................
  // OBSERVERS
  //
  statusDidChange: function(){
	 var status = this.get('status');
	 if(status === SC.Record.READY_CLEAN) {
	   this.updateActualHours(),
		 this.updateBudgetedHours();
		}
	}.observes('status'),

  balanceHoursTotal: function() {
    var value = this.get('summaryBudgetedHours') - this.get('summaryActualHours');
				return SC.Math.round(value, XT.QTY_SCALE);
  }.property('summaryBudgetedHours','summaryActualHours'),
/*
  balanceExpensesDidChange: function() {
    var tasks = this.get('tasks');
        balExpenses = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = status & SC.Record.DESTROYED ? 0 : task.get('actualExpenses') - task.get('budgetedExpenses');
      balExpenses = balExpenses - expenses;
    }
    this.setIfChanged('summaryBalanceExpenses', SC.Math.round(balExpenses, XT.MONEY_SCALE));
  }.observes('actualExpenses','budgetedExpenses'),
	*/
  inProcessStatusDidChange: function() {
    var status = this.get('status'),
        projectStatus = this.get('projectStatus');

    if(this.isDirty()) {
      if(projectStatus === XM.Project.IN_PROCESS) this.set('assignDate', SC.DateTime.create());    
    }
  }.observes('projectStatus'),
	
  completedStatusDidChange: function() {
    var status = this.get('status'),
        projectStatus = this.get('projectStatus');

    if(this.isDirty()) {
      if(projectStatus === XM.Project.COMPLETED) this.set('completeDate', SC.DateTime.create());    
    }
  }.observes('projectStatus'),
	
  projectNumberDidChange: function() {
    if(this.get('status') === SC.Record.READY_DIRTY) {
      this.number.set('isEditable', false);
    }
  },//.observes('status')
});

XM.Project.mixin( /** @scope XM.Project */ {

/**
  Concept status for project.
  
  @static
  @constant
  @type String
  @default P
*/
  CONCEPT: 'P',

/**
  In-Process status for project.
  
  @static
  @constant
  @type String
  @default O
*/
  IN_PROCESS: 'O',

/**
  Completed status for project.
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'
  
});
