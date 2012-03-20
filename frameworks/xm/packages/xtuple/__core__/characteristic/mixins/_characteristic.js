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
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type Number
  */
  characteristicType: SC.Record.attr(Number, {
    label: '_characteristicType'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    label: '_order'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type String
  */
  mask: SC.Record.attr(String, {
    label: '_mask'.loc()
  }),

  /**
    @type String
  */
  validator: SC.Record.attr(String, {
    label: '_validator'.loc()
  }),

  /**
    @type XM.CharacteristicOption
  */
  options: SC.Record.toMany('XM.CharacteristicOption', {
    label: '_options'.loc()
  }),

  /**
    @type Boolean
  */
  isAddresses: SC.Record.attr(Boolean, {
    label: '_isAddresses'.loc()
  }),

  /**
    @type Boolean
  */
  isContacts: SC.Record.attr(Boolean, {
    label: '_isContacts'.loc()
  }),

  /**
    @type Boolean
  */
  isItems: SC.Record.attr(Boolean, {
    label: '_isItems'.loc()
  })

};
