// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemCharacteristic
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemCharacteristic = {
  /** @scope XM.ItemCharacteristic.prototype */
  
  className: 'XM.ItemCharacteristic',

  

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
    @type Number
  */
  item: SC.Record.attr(Number, {
    label: '_item'.loc()
  }),

  /**
    @type XM.Characteristic
  */
  characteristic: SC.Record.attr('XM.Characteristic', {
    label: '_characteristic'.loc()
  }),

  /**
    @type Number
  */
  value: SC.Record.attr(Number, {
    label: '_value'.loc()
  })

};
