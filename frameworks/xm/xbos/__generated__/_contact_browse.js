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
XM._ContactBrowse = XM.Record.extend(
  /** @scope XM._ContactBrowse.prototype */ {
  
  className: 'XM.ContactBrowse',

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
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  firstName: SC.Record.attr(String),

  /**
    @type String
  */
  middleName: SC.Record.attr(String),

  /**
    @type String
  */
  lastName: SC.Record.attr(String),

  /**
    @type String
  */
  suffix: SC.Record.attr(String),

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
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  })

});
