// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Activity
  @extends XM.Recurrence
  @version 0.2
*/
XM.Project = XM.Activity.extend( XM.CoreAssignments,
    /** @scope XM.Project.prototype */ {

  className: 'XM.Project',

  createPrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),
  readPrivilege:   'ViewPersonalProjects ViewAllProjects',
  updatePrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),
  deletePrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),

  /**
  @type String
  */
  name: SC.Record.attr(String, {
    isRequired: YES
  }),
  
  /**
  @type String
  */
  projectStatus: SC.Record.attr(String, { 
    /** @private */
    defaultValue: function() {
      return XM.Project.CONCEPT;
    }
  }),
  
  /**
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type XM.Account
  */
  dueDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d', 
    isRequired: YES,
  }),
  
  /**
  @type SC.DateTime
  */
  assignDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  completeDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type XM.ProjectRecurrence
  */
  recurrence: SC.Record.toOne('XM.ProjectRecurrence', {
    isNested: YES
  }),
  
  /**
  @type XM.ProjectTask
  */
  tasks: SC.Record.toMany('XM.ProjectTask', {
    isNested: YES,
    inverse:  'project'
  }),
  
  /**
  @type XM.ProjectComment
  */
  comments: XM.Record.toMany('XM.ProjectComment', {
    isNested: YES,
    inverse: 'project'
  }),
  
  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
  sourceType: 'J',
  
  /**
  @type XM.ProjectAssignment
  */
  projects: XM.Record.toMany('XM.ProjectAssignment', {
    isNested: YES
  }),
  
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


  // ..........................................................
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
