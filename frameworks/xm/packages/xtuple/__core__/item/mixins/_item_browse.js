// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemBrowse
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemBrowse = {
  /** @scope XM.ItemBrowse.prototype */
  
  className: 'XM.ItemBrowse',

  

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
    @type Number
  */
  number: SC.Record.attr(Number, {
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  description1: SC.Record.attr(String, {
    label: '_description1'.loc()
  }),

  /**
    @type String
  */
  description2: SC.Record.attr(String, {
    label: '_description2'.loc()
  }),

  /**
    @type String
  */
  itemType: SC.Record.attr(String, {
    label: '_itemType'.loc()
  }),

  /**
    @type String
  */
  barcode: SC.Record.attr(String, {
    label: '_barcode'.loc()
  }),

  /**
    @type Boolean
  */
  isSold: SC.Record.attr(Boolean, {
    label: '_isSold'.loc()
  }),

  /**
    @type Number
  */
  listPrice: SC.Record.attr(Number, {
    label: '_listPrice'.loc()
  })

};
