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
		ORM - CRM Account and Contact should be added as standard associations for Project (Add to Parent of Project)
		Add additional filters to Project List (Don't Due just check)
		Observes - The assigned date should automatically populate on a Project or Project Task when the document is assigned
		Observes - The completed date should automatically populate on a Project or Project Task when the document status is changed to completed
		Project and Project Task should be modified to be able to keep track of date changes by whom and when (Handle by db check it)
		Method - Add the ability to copy Projects
		Observes - balanceHours subtract calc
		Observes - balanceExpenses subtract calc
		
 */
 //budgetedHours: 0,
 
 //actualHours: 0,
  // .................................................
  // CALCULATED PROPERTIES
  //
  number: SC.Record.attr(Number, {
    toType: function(record, key, value) {
      if(value) return value.toUpperCase();
    }
  }),
	
  updateBudgetedHours: function() {
    var tasks = this.get('tasks'),
        budgetedHours = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = status & SC.Record.DESTROYED ? 0 : task.get('budgetedHours');
      budgetedHours = budgetedHours + hours;
    }
    this.setIfChanged('budgetedHours', SC.Math.round(budgetedHours, XT.QTY_SCALE));
  },	
	
  updateActualHours: function() {
    var tasks = this.get('tasks'),
        actualHours = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = status & SC.Record.DESTROYED ? 0 : task.get('actualHours');
      actualHours = actualHours + hours;
    }
    this.setIfChanged('actualHours', SC.Math.round(actualHours, XT.QTY_SCALE));
  },	
	
  updateBudgetedExpenses: function() {
    var tasks = this.get('tasks'),
        budgetedExpenses = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = status & SC.Record.DESTROYED ? 0 : task.get('budgetedExpenses');
      budgetedExpenses = budgetedExpenses + expenses;
    }
    this.setIfChanged('budgetedExpenses', SC.Math.round(budgetedExpenses, XT.MONEY_SCALE));
  },	
	
  updateActualExpenses: function() {
    var tasks = this.get('tasks'),
        actualExpenses = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = status & SC.Record.DESTROYED ? 0 : task.get('actualExpenses');
      actualExpenses = actualExpenses + expenses;
    }
    this.setIfChanged('actualExpenses', SC.Math.round(actualExpenses, XT.MONEY_SCALE));
  },	
	/*
  balanceHours: function() {
	  var budgetedHours = this.get('budgetedHours'),
		    actualhours = this.get('actualHours');
				balanceHours = budgetedHours - actualHours;
	this.setIfChanged('balanceHours', SC.Math.round(balanceHours, XM.QTY_SCALE));
  }.observes('budgetedHours','actualHours'),
	
	summaryBalanceExpenses: function() {
	  var budgetedExpenses = this.get('budgetedExpenses'),
		    actualExpenses = this.get('actualExpenses');
				value = budgetedExpenses - actualExpenses;
		return value;
	this.setIfChanged('value', SC.Math.round(value, XM.MONEY_SCALE));
	},
  */
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  projectStatusDidChange: function() {
    var status = this.get('status'),
        projectStatus = this.get('projectStatus');

    if(status & SC.Record.READY_NEW) {
      if(projectStatus === XM.Project.COMPLETED) this.set('completeDate', SC.DateTime.create());    
    }
  }.observes('projectStatus'),
  projectNumberDidChange: function() {
    if(this.get('status') === SC.Record.READY_DIRTY) {
      this.number.set('isEditable', false);
    }
  },//.observes('status')
   /* @private */
  _projectsLength: 0,
  
  /* @private */
  _projectsLengthBinding: '*projects.length',
  
  /* @private */
  _projectsDidChange: function() {
    var documents = this.get('documents'),
        projects = this.get('projects');

    documents.addEach(projects);    
  }.observes('projects'),
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
