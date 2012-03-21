// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.SiteZone
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._SiteZone = {
  /** @scope XM.SiteZone.prototype */
  
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
  site: SC.Record.toOne('XM.Site', {
    label: '_site'.loc()
  }),

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
