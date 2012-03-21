// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UserAccountRole
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UserAccountRole = {
  /** @scope XM.UserAccountRole.prototype */
  
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
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type XM.UserAccountRolePrivilegeAssignment
  */
  privileges: SC.Record.toMany('XM.UserAccountRolePrivilegeAssignment', {
    label: '_privileges'.loc()
  })

};
