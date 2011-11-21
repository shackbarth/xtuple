// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserUserRoleAssignment = XM.Record.extend(
/** @scope XM.UserRoleAssignment.prototype */ {

  className: 'XM.UserUserRoleAssignment',

  /**
  @type XM.User
  */
  user:  SC.Record.toOne('XM.User'),

  /**
  @type XM.Role
  */
  userRole: SC.Record.toOne('XM.UserRole'),

});
