// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._UserAccountRole = XM.Record.extend(
  /** @scope XM._UserAccountRole.prototype */ {
  
  className: 'XM.UserAccountRole',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainGroups",
      "read": "MaintainGroups",
      "update": "MaintainGroups",
      "delete": "MaintainGroups"
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.UserAccountRolePrivilegeAssignment
  */
  privileges: SC.Record.toMany('XM.UserAccountRolePrivilegeAssignment')

});
