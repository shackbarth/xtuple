// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UserAccountPrivilegeAssignment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UserAccountPrivilegeAssignment = {
  /** @scope XM.UserAccountPrivilegeAssignment.prototype */
  
  className: 'XM.UserAccountPrivilegeAssignment',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
      "delete": true
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
  userAccount: SC.Record.attr(String),

  /**
    @type XM.Privilege
  */
  privilege: SC.Record.toOne('XM.Privilege', {
    isNested: true
  })

};
