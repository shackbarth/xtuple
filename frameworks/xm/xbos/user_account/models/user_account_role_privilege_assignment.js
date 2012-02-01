// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserAccountRolePrivilegeAssignment = XM.Record.extend(
/** @scope XM.UserAccountRolePrivilegeAssignment.prototype */ {

  className: 'XM.UserAccountRolePrivilegeAssignment',

  /**
  @type XM.UserAccountRole
  */
  userAccountRole: SC.Record.toOne('XM.UserAccountRole'),

  /**
  @type XM.Privilege
  */
  privilege: SC.Record.toOne('XM.Privilege'),

});

