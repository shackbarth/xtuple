// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  @extends XM.Record
  @version 0.1
*/
XM.UserAccountRoleInfo = XM.Record.extend(
/** @scope XM.UserAccountRoleInfo.prototype */ {

  className: 'XM.UserAccountRoleInfo',

  isEditable: NO,

  /**
  @type String
  */
  name: SC.Record.attr(String, { 
    isRequired: YES 
  }),
  
  /**
  @type XM.UserAccountRolePrivilegeAssignment
  */
  privileges: SC.Record.toMany('XM.UserAccountRolePrivilegeAssignment', { 
    isMaster: NO,
    inverse: 'userAccountRole'
  })
  
}) ;

