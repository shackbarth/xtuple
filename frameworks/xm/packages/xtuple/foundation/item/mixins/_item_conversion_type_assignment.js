// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemConversionTypeAssignment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemConversionTypeAssignment = {
  /** @scope XM.ItemConversionTypeAssignment.prototype */
  
  className: 'XM.ItemConversionTypeAssignment',

  

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
    @type XM.ItemConversion
  */
  itemConversion: SC.Record.toOne('XM.ItemConversion'),

  /**
    @type XM.Unit
  */
  unitType: SC.Record.toOne('XM.Unit', {
    isRequired: true
  })

};
