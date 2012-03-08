// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ProjectTask = XM.Record.extend(
  /** @scope XM._ProjectTask.prototype */ {
  
  className: 'XM.ProjectTask',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllProjects",
      "read": "ViewAllProjects",
      "update": "MaintainAllProjects",
      "delete": "MaintainAllProjects"
    },
    "personal": {
      "create": "MaintainPersonalProjects",
      "read": "ViewPersonalProjects",
      "update": "MaintainPersonalProjects",
      "delete": "MaintainPersonalProjects",
      "properties": [
        "owner",
        "assignedTo",
        "projectOwner",
        "projectAssignedTo"
      ]
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type XM.Project
  */
  project: SC.Record.toOne('XM.Project'),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type String
  */
  projectTaskStatus: SC.Record.attr(String),

  /**
    @type Number
  */
  budgetedHours: SC.Record.attr(Number),

  /**
    @type Number
  */
  actualHours: SC.Record.attr(Number),

  /**
    @type Number
  */
  budgetedExpenses: SC.Record.attr(Number),

  /**
    @type Number
  */
  actualExpenses: SC.Record.attr(Number),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.ProjectTaskComment
  */
  comments: SC.Record.toMany('XM.ProjectTaskComment', {
    isNested: true,
    inverse: 'project_task'
  }),

  /**
    @type XM.ProjectTaskAlarm
  */
  alarms: SC.Record.toMany('XM.ProjectTaskAlarm', {
    isNested: true,
    inverse: 'project_task'
  })

});
