// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserRole = XM.Record.extend(
/** @scope XM.UserRole.prototype */ {

  className: 'XM.UserRole',

  createPrivilege: 'MaintainGroups',
  readPrivilege:   'MaintainGroups',
  updatePrivilege: 'MaintainGroups',
  deletePrivilege: 'MaintainGroups',

  /**
  @type String
  */
  name:       SC.Record.attr(String, { 
    isRequired: YES 
  }),
  
  /**
  @type String
  */
  description:    SC.Record.attr(String),
  
  /**
  @type XM.RolePrivilege
  */
  privileges: SC.Record.toMany('XM.RolePrivilege', { 
    isMaster: NO,
    inverse:  'roles',
  }),
  
  /**
  @type XM.UserRole
  */
  users:      SC.Record.toMany('XM.UserRoleAssignment', { 
    isMaster: NO,
    inverse:  'roles',
  }),
  
}) ;

