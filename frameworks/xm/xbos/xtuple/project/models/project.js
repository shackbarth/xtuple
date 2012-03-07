// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_project');
sc_require('mixins/core_documents');

/**
  @class

  @extends XM._Project
  @extends XM.CoreDocuments
*/
XM.Project = XM._Project.extend( XM.CoreDocuments,
  /** @scope XM.Project.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
  @field
  @type Number
  */
  budgetedHours: function() {
    //TODO: Write this
    return 0;
  }.property(),

  /**
  @field
  @type Number
  */
  actualHours: function() {
    //TODO: Write this
    return 0;
  }.property(),

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
  budgetedExpenses: function() {
    //TODO: Write this
    return 0;
  }.property(),

  /**
  @field
  @type Number
  */
  actualExpenses: function() {
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
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

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
