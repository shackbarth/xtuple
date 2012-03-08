// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Project
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Project = XM.Record.extend(
  /** @scope XM.Project.prototype */ {
  
  className: 'XM.Project',

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
        "assignedTo"
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
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

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
    @type String
  */
  projectStatus: SC.Record.attr(String),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type XM.ProjectRecurrence
  */
  recurrences: SC.Record.toMany('XM.ProjectRecurrence'),

  /**
    @type XM.ProjectComment
  */
  comments: SC.Record.toMany('XM.ProjectComment', {
    isNested: true,
    inverse: 'project'
  }),

  /**
    @type XM.ProjectTask
  */
  tasks: SC.Record.toMany('XM.ProjectTask', {
    isNested: true,
    inverse: 'project'
  }),

  /**
    @type XM.ProjectContact
  */
  contacts: SC.Record.toMany('XM.ProjectContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ProjectItem
  */
  items: SC.Record.toMany('XM.ProjectItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ProjectFile
  */
  files: SC.Record.toMany('XM.ProjectFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ProjectImage
  */
  images: SC.Record.toMany('XM.ProjectImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ProjectUrl
  */
  urls: SC.Record.toMany('XM.ProjectUrl', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ProjectProject
  */
  projects: SC.Record.toMany('XM.ProjectProject', {
    isNested: true,
    inverse: 'source'
  })

});
