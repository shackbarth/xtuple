// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UserAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UserAccount = {
  /** @scope XM.UserAccount.prototype */
  
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
  username: SC.Record.attr(String, {
    label: '_username'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  propername: SC.Record.attr(String, {
    label: '_propername'.loc()
  }),

  /**
    @type String
  */
  password: SC.Record.attr(String, {
    label: '_password'.loc()
  }),

  /**
    @type String
  */
  initials: SC.Record.attr(String, {
    label: '_initials'.loc()
  }),

  /**
    @type String
  */
  email: SC.Record.attr(String, {
    label: '_email'.loc()
  }),

  /**
    @type XM.Locale
  */
  locale: SC.Record.toOne('XM.Locale', {
    label: '_locale'.loc()
  }),

  /**
    @type Boolean
  */
  disableExport: SC.Record.attr(Boolean, {
    label: '_disableExport'.loc()
  }),

  /**
    @type Boolean
  */
  canCreateUsers: SC.Record.attr(Boolean, {
    label: '_canCreateUsers'.loc()
  }),

  /**
    @type Boolean
  */
  isDatabaseUser: SC.Record.attr(Boolean, {
    label: '_isDatabaseUser'.loc()
  }),

  /**
    @type XM.UserAccountPrivilegeAssignment
  */
  grantedPrivileges: SC.Record.toMany('XM.UserAccountPrivilegeAssignment', {
    label: '_grantedPrivileges'.loc()
  }),

  /**
    @type XM.UserAccountRole
  */
  userAccountRoles: SC.Record.toMany('XM.UserAccountRole', {
    isNested: true,
    inverse: 'guid',
    label: '_userAccountRoles'.loc()
  }),

  /**
    @type XM.UserAccountUserAccountRoleAssignment
  */
  grantedUserAccountRoles: SC.Record.toMany('XM.UserAccountUserAccountRoleAssignment', {
    isNested: true,
    inverse: 'userAccount',
    label: '_grantedUserAccountRoles'.loc()
  })

};
