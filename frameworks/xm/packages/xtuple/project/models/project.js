// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ¬©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project');


/**
  @class

  @extends XM.Document
  @extends XM.Documents
*/
 /**
    To-Do as of 03/31/2012
		6F = Method - Add the ability to copy Projects
		6F1 = ORM add New Item Number and Off-set number	
 */
XM.Project = XM.Document.extend(XM._Project, XM.Documents, 
 /** @scope XM.Project.prototype */ {	
	summaryBudgetedHours: 0,
   
	summaryActualHours: 0,
	 
	summaryBudgetedExpenses: 0,
  
	summaryActualExpenses: 0,

  // .................................................
  // CALCULATED PROPERTIES
  //
  
	number: SC.Record.attr(Number, {
    toType: function(record, key, value) {
      if(value) return value.toUpperCase();
    }
  }),
	
  balanceHoursTotal: function() {
    var hours = this.get('summaryBudgetedHours') - this.get('summaryActualHours');
				return SC.Math.round(hours, XT.QTY_SCALE);
  }.property('summaryBudgetedHours','summaryActualHours'),
	
  balanceActualExpensesTotal: function() {
    var expenses = this.get('budgetedExpenses') - this.get('actualExpenses');
				return SC.Math.round(expenses, XT.MONEY_SCALE);
  }.property('summaryBudgetedExpenses','summaryActualExpenses'),
	
	copy: function() { return XM.Project.copy(this) },
	
  //..................................................
  // METHODS
  //
	
  updateBudgetedHours: function() {
    var tasks = this.get('tasks'),
        budgetedHours = 0;
    for(var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = status & SC.Record.DESTROYED ? 0 : task.get('budgetedHours');
      budgetedHours = budgetedHours + hours;
    }
    this.setIfChanged('summaryBudgetedHours', SC.Math.round(budgetedHours, XT.QTY_SCALE));
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
    this.setIfChanged('summaryActualHours', SC.Math.round(actualHours, XT.QTY_SCALE));
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
    this.setIfChanged('summaryBudgetedExpenses', SC.Math.round(budgetedExpenses, XT.MONEY_SCALE));
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
    this.setIfChanged('summaryActualExpenses', SC.Math.round(actualExpenses, XT.MONEY_SCALE));
  },	

  //..................................................
  // OBSERVERS
  //
  statusDidChange: function(){
	 var status = this.get('status');
	 if(status === SC.Record.READY_CLEAN) {
	   this.updateActualHours(),
		 this.updateBudgetedHours(),
		 this.updateActualExpenses(),
		 this.updateBudgetedExpenses();
		}
	}.observes('status'),
	
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

XM.Project.copy = function(project) {
  if(!SC.kindOf(project, XM.Project)) return NO;

  var store = address.get('id'),
  hash = project.get('attributes');

  delete hash.guid;
  delete hash.number;
  delete hash.notes;

  return store.createRecord(XM.Address, hash).normalize();
}

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
