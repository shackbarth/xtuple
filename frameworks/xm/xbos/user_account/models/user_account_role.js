// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserAccountRole = XM.Record.extend(
/** @scope XM.UserAccountRole.prototype */ {

  className: 'XM.UserAccountRole',

  createPrivilege: 'MaintainGroups',
  readPrivilege:   'MaintainGroups',
  updatePrivilege: 'MaintainGroups',
  deletePrivilege: 'MaintainGroups',

  /**
  @type String
  */
  name: SC.Record.attr(String, { 
    isRequired: YES 
  }),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type XM.RolePrivilege
  */
  privileges: SC.Record.toMany('XM.RolePrivilege', { 
    isMaster: NO,
    inverse:  'roles',
  }),
  
  /**
  @type XM.UserAccountRole
  */
  userAccounts: SC.Record.toMany('XM.UserAccountRoleAssignment', { 
    isMaster: NO,
    inverse:  'roles',
  }),
  
}) ;

