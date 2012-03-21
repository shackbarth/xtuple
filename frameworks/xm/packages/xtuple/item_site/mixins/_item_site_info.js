// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemSiteInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemSiteInfo = {
  /** @scope XM.ItemSiteInfo.prototype */
  
  className: 'XM.ItemSiteInfo',

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
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true,
    label: '_item'.loc()
  }),

  /**
    @type XM.SiteInfo
  */
  site: SC.Record.toOne('XM.SiteInfo', {
    isNested: true,
    label: '_site'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  })

};
