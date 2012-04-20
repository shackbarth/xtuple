// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.AccountInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._AccountInfo = {
  /** @scope XM.AccountInfo.prototype */
  
  className: 'XM.AccountInfo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAllCRMAccounts",
      "update": false,
      "delete": false
    },
    "personal": {
      "create": false,
      "read": true,
      "update": false,
      "delete": true,
      "properties": [
        "owner"
      ]
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
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type XM.AccountContactInfo
  */
  primaryContact: SC.Record.toOne('XM.AccountContactInfo', {
    isNested: true,
    label: '_primaryContact'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    label: '_owner'.loc()
  })

};
