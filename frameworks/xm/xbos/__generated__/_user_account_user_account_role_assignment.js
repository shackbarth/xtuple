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
XM._UserAccountUserAccountRoleAssignment = XM.Record.extend(
  /** @scope XM._UserAccountUserAccountRoleAssignment.prototype */ {
  
  className: 'XM.UserAccountUserAccountRoleAssignment',

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
    @type XM.UserAccountRoleInfo
  */
  userAccountRole: SC.Record.toOne('XM.UserAccountRoleInfo', {
    isNested: true
  })

});
