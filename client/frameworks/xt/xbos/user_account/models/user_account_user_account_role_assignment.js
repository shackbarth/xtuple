// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserAccountUserAccountRoleAssignment = XM.Record.extend(
/** @scope XM.UserAccountUserAccountRoleAssignment.prototype */ {

  className: 'XM.UserAccountUserAccountRoleAssignment',

  /**
  @type XM.UserAccount
  */
  userAccount:  SC.Record.toOne('XM.UserAccount'),

  /**
  @type XM.Role
  */
  userAccountRole: SC.Record.toOne('XM.UserAccountRole'),

});
