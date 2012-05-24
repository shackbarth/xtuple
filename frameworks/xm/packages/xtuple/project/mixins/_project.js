// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Project
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Project = {
  /** @scope XM.Project.prototype */
  
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
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

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
    useIsoDate: false,
    isRequired: true
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
    isNested: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'assignedTo');
        ret = '_loading'.loc();
      }
    }
  }),

  /**
    @type String
  */
  projectStatus: SC.Record.attr(String, {
    isRequired: true,
    defaultValue: 'P'
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'owner');
        ret = '_loading'.loc();
      }
    }
  }),

  /**
    @type XM.ProjectRecurrence
  */
  recurrences: SC.Record.toMany('XM.ProjectRecurrence', {
    inverse: 'project'
  }),

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
    @type XM.ProjectAccount
  */
  accounts: SC.Record.toMany('XM.ProjectAccount', {
    isNested: true,
    inverse: 'source'
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

};
