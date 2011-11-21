// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  This class should never be used directly except by privilege management.

  @extends XM.Record
  @version 0.1
*/
XM.UserPrivilegeAssignment = XM.Record.extend(
/** @scope XM.UserPrivilegeAssignment.prototype */ {

  className: 'XM.UserPrivilegeAssignment',

  /**
  @type XM.Privilege
  */
  privilege: SC.Record.toOne('XM.Privilege'),
  
  /**
  @type XM.User
  */
  user: SC.Record.toOne('XM.User'),
  
});

