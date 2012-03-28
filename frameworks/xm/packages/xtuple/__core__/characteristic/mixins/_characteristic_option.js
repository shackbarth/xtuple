// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CharacteristicOption
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CharacteristicOption = {
  /** @scope XM.CharacteristicOption.prototype */
  
  className: 'XM.CharacteristicOption',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
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
    @type XM.Characteristic
  */
  characteristic: SC.Record.toOne('XM.Characteristic', {
    label: '_characteristic'.loc()
  }),

  /**
    @type String
  */
  value: SC.Record.attr(String, {
    label: '_value'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    defaultValue: 0,
    label: '_order'.loc()
  })

};
