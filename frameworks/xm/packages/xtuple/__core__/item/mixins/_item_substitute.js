// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemSubstitute
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemSubstitute = {
  /** @scope XM.ItemSubstitute.prototype */
  
  className: 'XM.ItemSubstitute',

  

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
    @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    label: '_item'.loc()
  }),

  /**
    @type XM.Item
  */
  substituteItem: SC.Record.toOne('XM.Item', {
    label: '_substituteItem'.loc()
  }),

  /**
    @type Number
  */
  conversionRatio: SC.Record.attr(Number, {
    label: '_conversionRatio'.loc()
  }),

  /**
    @type Number
  */
  rank: SC.Record.attr(Number, {
    label: '_rank'.loc()
  })

};
