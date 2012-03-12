// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_project');
sc_require('mixins/crm_documents');
sc_require('mixins/core_documents');
sc_require('mixins/document');

/**
  @class

  @extends XM._Project
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Project = XM._Project.extend( XM.Document, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Project.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

<<<<<<< HEAD
  /**
  @field
  @type Number
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  /**
  @field
  @type Number
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  /**
  @field
  @type Number
  */
  assignedDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  /**
  @field
  @type Number
  */
  completeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  /** 1
  @field
  @type Number
  */
  budgetedHours: function() {
    //TODO: Write this
    return 0;
  }.property(),

  /**1
  @field
  @type Number
=======
console.log("Here I am");

  /**
    @type XM.UserAccountInfo
>>>>>>> d3fb0e920abb92deacdb28ef9cbef3690007de28
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
    }
  }),

console.log("Here I am");

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
    }
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
    }
  }),

=======
  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
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
	  //TODO: Write this
	  return 0;
	}.property(),

	/**
	@field
	@type Number
	*/
	balanceExpenses: function() {
	  //var value = this.get('budgetedExpenses') - this.get('actualExpenses');
	  return 0;
	}.property(),



>>>>>>> d3fb0e920abb92deacdb28ef9cbef3690007de28
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = this.get('validateErrors'), val, err;

    // Validate Number
    val = this.get('number') ? this.get('number').length : 0;
    err = XM.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !val);

    // Validate Due Date
    val = this.get('dueDate') ? this.get('dueDate') : 0;
    err = XM.errors.findProperty('code', 'xt1000');
    this.updateErrors(err, !val);
    
    return errors;
  }.observes('number', 'dueDate'),

  _xm_projectStatusDidChange: function() {
    var status = this.get('status'),
        _projectStatus = this.get('projectStatus');
console.log(_projectStatus);
    if(status & SC.Record.READY) {
      if(_projectStatus === XM.Project.COMPLETED) this.set('completeDate', SC.DateTime.create());    
    }
  }.observes('projectStatus'),

   /* @private */
  _projectsLength: 0,
  
  /* @private */
  _projectsLengthBinding: '.projects.length',
  
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
