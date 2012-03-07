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
XM._ContactInfo = XM.Record.extend(
  /** @scope XM._ContactInfo.prototype */ {
  
  className: 'XM.ContactInfo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
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
  })

});
