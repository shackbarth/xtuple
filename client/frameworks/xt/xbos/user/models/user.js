// ==========================================================================
// Project:   XM.User
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1

  @todo handle password seeding for cloud and enhanced auth
*/
XM.User = XM.Record.extend(
/** @scope XM.User.prototype */ {

  className: 'XM.User',
  primaryKey: 'username',

  createPrivilege: 'MaintainUsers',
  readPrivilege:   'ViewUsers',
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
  @type XM.UserPrivilege
  */
  privileges: SC.Record.toMany('XM.UserPrivilegeAssignment', { 
    isMaster: NO,
    inverse:  'user',  
  }),
  
  /**
  @type XM.UserRole
  */
  userRoles:     SC.Record.toMany('XM.UserRoleAssignment', { 
    isMaster: NO,
    inverse:  'user',  
  }),

});

XM.User.canRead = function(record) {
  return (record === XM.get('currentUser') ||
          XM.getPath('currentUser.isAdmin') ||
          sc_super());
};

XM.User.canUpdate = function(record) {
  return (record === XM.get('currentUser') ||
          XM.getPath('currentUser.isAdmin') ||
          sc_super());
};

XM.User.canDelete = function() {
  return XM.getPath('currentUser.isAdmin') && sc_super();
};

