// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  This class should never be used directly except by privilege management.

  @extends XM.Record
  @version 0.1
*/
XM.UserAccountPrivilegeAssignment = XM.Record.extend(
/** @scope XM.UserAccountPrivilegeAssignment.prototype */ {

  className: 'XM.UserAccountPrivilegeAssignment',

  /**
  @type XM.Privilege
  */
  privilege: SC.Record.toOne('XM.Privilege'),
  
  /**
  @type XM.UserAccount
  */
  userAccount: SC.Record.toOne('XM.UserAccount'),
  
});

