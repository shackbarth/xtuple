// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Characteristic
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Characteristic = {
  /** @scope XM.Characteristic.prototype */
  
  className: 'XM.Characteristic',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCharacteristics",
      "read": "ViewCharacteristics",
      "update": "MaintainCharacteristics",
      "delete": "MaintainCharacteristics"
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
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type Number
  */
  characteristicType: SC.Record.attr(Number, {
    defaultValue: 0
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    defaultValue: 0
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type String
  */
  mask: SC.Record.attr(String),

  /**
    @type String
  */
  validator: SC.Record.attr(String),

  /**
    @type XM.CharacteristicOption
  */
  options: SC.Record.toMany('XM.CharacteristicOption', {
    inverse: 'characteristic'
  }),

  /**
    @type Boolean
  */
  isAddresses: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isContacts: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isItems: SC.Record.attr(Boolean)

};
