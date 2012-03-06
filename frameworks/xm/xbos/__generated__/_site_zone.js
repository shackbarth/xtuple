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
XM._SiteZone = XM.Record.extend(
  /** @scope XM._SiteZone.prototype */ {
  
  className: 'XM.SiteZone',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
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
    @type XM.Site
  */
  site: SC.Record.toOne('XM.Site'),

  /**
    @type Number
  */
  name: SC.Record.attr(Number),

  /**
    @type String
  */
  description: SC.Record.attr(String)

});
