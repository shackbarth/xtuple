// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectTask
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectTask = {
  /** @scope XM.ProjectTask.prototype */
  
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
  number: SC.Record.attr(String, {
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type XM.Project
  */
  project: SC.Record.toOne('XM.Project', {
    label: '_project'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type String
  */
  projectTaskStatus: SC.Record.attr(String, {
    label: '_projectTaskStatus'.loc()
  }),

  /**
    @type Number
  */
  budgetedHours: SC.Record.attr(Number, {
    label: '_budgetedHours'.loc()
  }),

  /**
    @type Number
  */
  actualHours: SC.Record.attr(Number, {
    label: '_actualHours'.loc()
  }),

  /**
    @type Number
  */
  budgetedExpenses: SC.Record.attr(Number, {
    label: '_budgetedExpenses'.loc()
  }),

  /**
    @type Number
  */
  actualExpenses: SC.Record.attr(Number, {
    label: '_actualExpenses'.loc()
  }),

  /**
    @type Date
  */
  startDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_startDate'.loc()
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_dueDate'.loc()
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_assignDate'.loc()
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_completeDate'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  assignedTo: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    label: '_assignedTo'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    label: '_owner'.loc()
  }),

  /**
    @type XM.ProjectTaskComment
  */
  comments: SC.Record.toMany('XM.ProjectTaskComment', {
    isNested: true,
    inverse: 'project_task',
    label: '_comments'.loc()
  }),

  /**
    @type XM.ProjectTaskAlarm
  */
  alarms: SC.Record.toMany('XM.ProjectTaskAlarm', {
    isNested: true,
    inverse: 'project_task',
    label: '_alarms'.loc()
  })

};
