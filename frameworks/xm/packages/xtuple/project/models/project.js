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
    this.setIfChanged('budgetedHours', SC.Math.round(budgetedHours, XM.QTY_SCALE));
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
    this.setIfChanged('actualHours', SC.Math.round(actualHours, XM.QTY_SCALE));
  },	
	/*
  balanceHours: function() {
	  var budgetedHours = this.get('budgetedHours'),
		    actualhours = this.get('actualHours');
				balanceHours = budgetedHours - actualHours;
	this.setIfChanged('balanceHours', SC.Math.round(balanceHours, XM.QTY_SCALE));
  }.observes('budgetedHours','actualHours'),
	*/
	/**
	 Recalulate total hours budgets, total hours actual, balance hours, 
							total expense budgeted, total expense actual, balance expense.
	*/
/*
	
	summarybalanceHours: function() {
	  var budgetedHours = this.get('budgetedHours'),
		    actualhours = this.get('actualHours');
				value = budgetedHours - actualHours;
		return value;
	this.setIfChanged('value', SC.Math.round(value, XM.QTY_SCALE));
	},
	
	summaryBudgetedExpenses: function() {
	  var budgetedExpenses = this.get('budgetedExpenses'),
				total = 0;
		for ( var i = 0; i < budgetedExpenses.get('length'); i++ ) {
		  var budgeted = budgetedExpenses.objectAt(i),
			    status = budgeted.get('status'),
					amount = status & SC.Record.DESTROYED ? 0 : budgeted.get('amount');
			value = value + budgetedExpenses.objectAt(i).get('budgetedExpenses');
		}
	this.setIfChanged('value', SC.Math.round(value, XM.MONEY_SCALE));
	},
	
	//this.get('tasks').objectAt(0).get('owner')
	
	summaryActualExpenses: function() {
	  var actualExpenses = this.get('actualExpenses'),
				total = 0;
		for ( var i = 0; i < actualExpenses.get('length'); i++ ) {
		  var budgeted = actualExpenses.objectAt(i),
			    status = budgeted.get('status'),
					amount = status & SC.Record.DESTROYED ? 0 : budgeted.get('amount');
			value = value + actualExpenses.objectAt(i).get('actualExpenses');
		}
	this.setIfChanged('value', SC.Math.round(value, XM.MONEY_SCALE));
	},
	
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
