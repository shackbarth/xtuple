// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.AccountContactInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._AccountContactInfo = {
  /** @scope XM.AccountContactInfo.prototype */
  
  className: 'XM.AccountContactInfo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAllContacts",
      "update": false,
      "delete": false
    },
    "personal": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false,
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
  name: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  jobTitle: SC.Record.attr(String),

  /**
    @type String
  */
  phone: SC.Record.attr(String),

  /**
    @type String
  */
  alternate: SC.Record.attr(String),

  /**
    @type String
  */
  fax: SC.Record.attr(String),

  /**
    @type String
  */
  primaryEmail: SC.Record.attr(String),

  /**
    @type String
  */
  webAddress: SC.Record.attr(String),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  })

};
