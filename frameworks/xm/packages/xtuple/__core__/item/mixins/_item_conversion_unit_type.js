// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemConversionUnitType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemConversionUnitType = {
  /** @scope XM.ItemConversionUnitType.prototype */
  
  className: 'XM.ItemConversionUnitType',

  

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
    @type XM.ItemConversion
  */
  itemUnitConversion: SC.Record.toOne('XM.ItemConversion', {
    label: '_itemUnitConversion'.loc()
  }),

  /**
    @type Number
  */
  itemUnitType: SC.Record.attr(Number, {
    label: '_itemUnitType'.loc()
  })

};
