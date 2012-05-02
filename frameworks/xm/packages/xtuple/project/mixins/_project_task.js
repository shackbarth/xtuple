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
    isRequired: true
  }),

  /**
    @type XM.Project
  */
  project: SC.Record.toOne('XM.Project'),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type String
  */
  projectTaskStatus: SC.Record.attr(String, {
    isRequired: true,
    defaultValue: 'P'
  }),

  /**
    @type Quantity
  */
  budgetedHours: SC.Record.attr(Quantity, {
    isRequired: true,
    defaultValue: 0
  }),

  /**
    @type Quantity
  */
  actualHours: SC.Record.attr(Quantity, {
    isRequired: true,
    defaultValue: 0
  }),

  /**
    @type Money
  */
  budgetedExpenses: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0
  }),

  /**
    @type Money
  */
  actualExpenses: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0
  }),

  /**
    @type Date
  */
  startDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  assignDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  completeDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
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

};
