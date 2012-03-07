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
XM._SiteType = XM.Record.extend(
  /** @scope XM._SiteType.prototype */ {
  
  className: 'XM.SiteType',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainSiteTypes",
      "read": "ViewSiteTypes",
      "update": "MaintainSiteTypes",
      "delete": "MaintainSiteTypes"
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
    @type Number
  */
  name: SC.Record.attr(Number),

  /**
    @type String
  */
  description: SC.Record.attr(String)

});
