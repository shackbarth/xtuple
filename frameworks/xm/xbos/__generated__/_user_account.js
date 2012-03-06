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
XM._UserAccount = XM.Record.extend(
  /** @scope XM._UserAccount.prototype */ {
  
  className: 'XM.UserAccount',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainUsers",
      "read": "MaintainUsers",
      "update": "MaintainUsers",
      "delete": false
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type String
  */
  username: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  propername: SC.Record.attr(String),

  /**
    @type String
  */
  password: SC.Record.attr(String),

  /**
    @type String
  */
  initials: SC.Record.attr(String),

  /**
    @type String
  */
  email: SC.Record.attr(String),

  /**
    @type XM.Locale
  */
  locale: SC.Record.toOne('XM.Locale'),

  /**
    @type Boolean
  */
  disableExport: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  canCreateUsers: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isDatabaseUser: SC.Record.attr(Boolean),

  /**
    @type XM.UserAccountPrivilegeAssignment
  */
  grantedPrivileges: SC.Record.toMany('XM.UserAccountPrivilegeAssignment'),

  /**
    @type XM.UserAccountRole
  */
  userAccountRoles: SC.Record.toMany('XM.UserAccountRole', {
    isNested: true,
    inverse: 'guid'
  }),

  /**
    @type XM.UserAccountUserAccountRoleAssignment
  */
  grantedUserAccountRoles: SC.Record.toMany('XM.UserAccountUserAccountRoleAssignment', {
    isNested: true,
    inverse: 'userAccount'
  })

});
