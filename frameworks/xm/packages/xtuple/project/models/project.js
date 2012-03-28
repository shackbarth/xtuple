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
  budgetedHours: function() {
  var budgetedHours = this.get('budgetedHours'),
      total = 0;
  for(var i = 0; i < budgetedHours.get('length'); i++) {
    total = total + budgetedHours.objectAt(i).get('budgetedHours');
  }
  return SC.Math.round(total, XM.QTY_SCALE);
  }.property('budgetedHours').cacheable(),

  actualHours: function() {
  var actualHours = this.get('actualHours'),
      total = 0;
  for(var i = 0; i < actualHours.get('length'); i++) {
    total = total + actualHours.objectAt(i).get('actualHours');
  }
  return SC.Math.round(total, XM.QTY_SCALE);
  }.property('actualHours').cacheable(),

  budgetedExpenses: function() {
  var budgetedExpenses = this.get('budgetedExpenses'),
      total = 0;
  for(var i = 0; i < budgetedExpenses.get('length'); i++) {
    total = total + budgetedExpenses.objectAt(i).get('budgetedExpenses');
  }
  return SC.Math.round(total, XM.MONEY_SCALE);
  }.property('budgetedExpenses').cacheable(),

  actualExpenses: function() {
  var actualExpenses = this.get('actualExpenses'),
      total = 0;
  for(var i = 0; i < actualExpenses.get('length'); i++) {
    total = total + actualExpenses.objectAt(i).get('actualExpenses');
  }
  return SC.Math.round(total, XM.MONEY_SCALE);
  }.property('actualExpenses').cacheable(),

  balanceHours: function() {
  var budgetedHours = this.get('budgetedHours'),
      actualHours = this.get('actualHours');
  return budgetedHours - actualHours;
  }.property('budgetedHours', 'actualHours').cacheable(),

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
