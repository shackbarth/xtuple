// ==========================================================================
// Project:   XM.Project
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Activity
  @extends XM.Recurrence
  @version 0.2
*/
XM.Project = XM.Activity.extend( XM.Recurrence,
    /** @scope XM.Project.prototype */ {

  className: 'XM.Project',

  createPrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),
  readPrivilege:   'ViewPersonalProjects ViewAllProjects',
  updatePrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),
  deletePrivilege: 'MaintainPersonalProjects MaintainAllProjects'.w(),

  /**
  @type String
  */
  projectStatus: SC.Record.attr(String, { 
    /** @private */
    defaultValue: XM.Project.CONCEPT,
  }),
  
  /**
  @type XM.Account
  */
  dueDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d', 
    isRequired: YES,
  }),
  
  /**
  @type XM.ProjectTask
  */
  tasks: SC.Record.toMany('XM.ProjectTask', {
    inverse:  'project',
  }),
  
  /**
  @type XM.ProjectComment
  */
  comments: XM.Record.toMany('XM.ProjectComment', {
    inverse: 'project',
  }),

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

/**
  Concept status for project.
  
  @static
  @constant
  @type String
  @default P
*/
XM.Project.CONCEPT = 'P';

/**
  In-Process status for project.
  
  @static
  @constant
  @type String
  @default O
*/
XM.Project.IN_PROCESS = 'O';

/**
  Completed status for project.
  @static
  @constant
  @type String
  @default C
*/
XM.Project.COMPLETED = 'C';

