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
XM._SiteInfo = XM.Record.extend(
  /** @scope XM._SiteInfo.prototype */ {
  
  className: 'XM.SiteInfo',

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
  code: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.SiteType
  */
  siteType: SC.Record.toOne('XM.SiteType'),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  })

});
