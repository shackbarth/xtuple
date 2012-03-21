// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerItem
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerItem = {
  /** @scope XM.CustomerItem.prototype */
  
  className: 'XM.CustomerItem',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
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
    @type XM.Customer
  */
  source: SC.Record.toOne('XM.Customer', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true,
    label: '_item'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
