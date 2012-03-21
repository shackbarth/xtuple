// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.SiteType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._SiteType = {
  /** @scope XM.SiteType.prototype */
  
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
  name: SC.Record.attr(Number, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  })

};
