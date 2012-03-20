// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM.Document
  @extends XM.CoreDocuments
  @extends XM.CrmDocuments
*/
XM.Project = XM.Document.extend(XM._Project, XM.CoreDocuments, XM.CrmDocuments,
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
	@field
	@type Number
	*/
	budgetedHours: function() {
	  var _budgetedHours = this.get('budgetedHours'),
	      total = 0;

	  for(var i = 0; i < _budgetedHours.get('length'); i++) {
	    total = total + _budgetedHours.objectAt(i).get('budgetedHours');
	  }

	  return total;
	}.property('_budgetedHoursLength').cacheable(),

	/**
	@field
	@type Number
	*/
	actualHours: function() {
	  var _actualHours = this.get('actualHours'),
	      total = 0;

	  for(var i = 0; i < _actualHours.get('length'); i++) {
	    total = total + _actualHours.objectAt(i).get('actualHours');
	  }

	  return total;
	}.property('_actualHoursLength').cacheable(),

	/**
	@field
	@type Number
	*/
	budgetedExpenses: function() {
	  var _budgetedExpenses = this.get('budgetedExpenses'),
	      total = 0;

	  for(var i = 0; i < _budgetedExpenses.get('length'); i++) {
	    total = total + _budgetedExpenses.objectAt(i).get('budgetedExpenses');
	  }

	  return total;
	}.property('_budgetedExpensesLength').cacheable(),

	/**
	@field
	@type Number
	*/
	actualExpenses: function() {
	  var _actualExpenses = this.get('actualExpenses'),
	      total = 0;

	  for(var i = 0; i < _actualExpenses.get('length'); i++) {
	    total = total + _actualExpenses.objectAt(i).get('actualExpenses');
	  }

	  return total;
	}.property('_actualExpensesLength').cacheable(),

	/**
	@field
	@type Number
	*/
	balanceHours: function() {
	  var budgetedHours = this.get('budgetedHours'),
	      actualHours = this.get('actualHours');

	  return budgetedHours - actualHours;
	}.property('budgetedHours', 'actualHours').cacheable(),

	/**
	@field
	@type Number
	*/
	balanceExpenses: function() {
	  var budgetedExpenses = this.get('budgetedExpenses'),
	      actualExpenses = this.get('actualExpenses');

	  return budgetedExpenses - actualExpenses;
	}.property('budgetedExpenses', 'actualExpenses').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments);
    
    return errors;
  }.observes('dueDate'),

  _xm_projectStatusDidChange: function() {
    var status = this.get('status'),
        projectStatus = this.get('projectStatus');

    if(status & SC.Record.READY) {
      if(projectStatus === XM.Project.COMPLETED) this.set('completeDate', SC.DateTime.create());    
    }
  }.observes('projectStatus'),

   /* @private */
  _projectsLength: 0,
  
  /* @private */
  _projectsLengthBinding: '*projects.length',
  
  /* @private */
  _projectsDidChange: function() {
    var documents = this.get('documents'),
        projects = this.get('projects');

    documents.addEach(projects);    
  }.observes('projectsLength'),
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
