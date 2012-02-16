// ==========================================================================
// Project:   XM.UserAccount
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1

  @todo handle password seeding for cloud and enhanced auth
*/
XM.UserAccount = XM.Record.extend(
/** @scope XM.UserAccount.prototype */ {

  className: 'XM.UserAccount',
  primaryKey: 'username',

  nestedRecordNamespace: XM,

  createPrivilege: 'MaintainUsers',
  readPrivilege:   'MaintainUsers',
  updatePrivilege: 'MaintainUsers',
  deletePrivilege: 'MaintainUsers',
  
  /**
  @type Boolean
  */
  active: SC.Record.attr(Boolean, { 
    isRequired: YES 
  }),
  
  /**
  @type String
  */
  propername: SC.Record.attr(String,  { isRequired: YES, } ),
  
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
  locale: SC.Record.toMany('XM.Locale'),
  
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
  isDatbaseUser: SC.Record.attr(Boolean),
  
  /**
  @type XM.UserAccountPrivilege
  */
  privileges: SC.Record.toMany('XM.UserAccountPrivilegeAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.UserAccountRole
  */
  roles: SC.Record.toMany('XM.UserAccountUserAccountRoleAssignment', { 
    isNested: YES 
  }),

});

XM.UserAccount.canRead = function(record) {
  return (record === XM.get('currentUser') ||
          XM.getPath('currentUserAccount.isAdmin') ||
          arguments.callee.base.apply(this, arguments));
};

XM.UserAccount.canUpdate = function(record) {
  return (record === XM.get('currentUser') ||
          XM.getPath('currentUserAccount.isAdmin') ||
          arguments.callee.base.apply(this, arguments));
};

XM.UserAccount.canDelete = function() {
  return XM.getPath('currentUserAccount.isAdmin') && arguments.callee.base.apply(this, arguments);
};

