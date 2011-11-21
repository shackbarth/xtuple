// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserRolePrivilegeAssignment = XM.Record.extend(
/** @scope XM.UserRolePrivilegeAssignment.prototype */ {

  className: 'XM.UserRolePrivilegeAssignment',

  /**
  @type XM.UserRole
  */
  userRole: SC.Record.toOne('XM.UserRole'),

  /**
  @type XM.Privilege
  */
  privilege: SC.Record.toOne('XM.Privilege'),

});

