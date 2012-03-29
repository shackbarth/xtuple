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
XM.Project = XM.Document.extend(XM._Project, XM.ProjectTask, XM.CoreDocuments, 
 /** @scope XM.Project.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //
  number: SC.Record.attr(Number, {
    toType: function(record, key, value) {
      if(value) return value.toUpperCase();
    }
  }),
	
	/**
	 Recalulate total hours budgets, total hours actual, balance hours, 
							total expense budgeted, total expense actual, balance expense.
	*/
	summaryBudgetedHours: function() {
	  var budgetedHours = this.get('budgetedHours'),
				total = 0;
		for ( var i = 0; i < budgetedHours.get('length'); i++ ) {
		  var budgeted = budgetedHours.objectAt(i),
			    status = budgeted.get('status'),
					hours = status & SC.Record.DESTROYED ? 0 : budgeted.get('hours');
			value = value + budgetedHours.objectAt(i).get('budgetedHours');
		}
	this.setIfChanged('value', SC.Math.round(value, XM.QTY_SCALE));
	},
	
	summaryActualHours: function() {
	  var actualHours = this.get('actualHours'),
				total = 0;
		for ( var i = 0; i < actualHours.get('length'); i++ ) {
		  var budgeted = actualHours.objectAt(i),
			    status = budgeted.get('status'),
					hours = status & SC.Record.DESTROYED ? 0 : budgeted.get('hours');
			value = value + actualHours.objectAt(i).get('actualHours');
		}
	this.setIfChanged('value', SC.Math.round(value, XM.QTY_SCALE));
	},
	
	summaryBalanceHours: function() {
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
