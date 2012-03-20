// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.UnitConversion
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._UnitConversion = {
  /** @scope XM.UnitConversion.prototype */
  
  className: 'XM.UnitConversion',

  

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
    @type XM.Unit
  */
  fromUnit: SC.Record.toOne('XM.Unit', {
    label: '_fromUnit'.loc()
  }),

  /**
    @type Number
  */
  fromValue: SC.Record.attr(Number, {
    label: '_fromValue'.loc()
  }),

  /**
    @type XM.Unit
  */
  toUnit: SC.Record.toOne('XM.Unit', {
    label: '_toUnit'.loc()
  }),

  /**
    @type Number
  */
  toValue: SC.Record.attr(Number, {
    label: '_toValue'.loc()
  })

};
