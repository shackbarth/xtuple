// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Address
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Address = {
  /** @scope XM.Address.prototype */
  
  className: 'XM.Address',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAddresses",
      "read": "ViewAddresses",
      "update": "MaintainAddresses",
      "delete": "MaintainAddresses"
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
  number: SC.Record.attr(String, {
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
  line1: SC.Record.attr(String, {
    label: '_line1'.loc()
  }),

  /**
    @type String
  */
  line2: SC.Record.attr(String, {
    label: '_line2'.loc()
  }),

  /**
    @type String
  */
  line3: SC.Record.attr(String, {
    label: '_line3'.loc()
  }),

  /**
    @type String
  */
  city: SC.Record.attr(String, {
    label: '_city'.loc()
  }),

  /**
    @type String
  */
  state: SC.Record.attr(String, {
    label: '_state'.loc()
  }),

  /**
    @type String
  */
  postalCode: SC.Record.attr(String, {
    label: '_postalCode'.loc()
  }),

  /**
    @type String
  */
  country: SC.Record.attr(String, {
    label: '_country'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.AddressComment
  */
  comments: SC.Record.toMany('XM.AddressComment', {
    isNested: true,
    inverse: 'address',
    label: '_comments'.loc()
  }),

  /**
    @type XM.AddressCharacteristic
  */
  characteristics: SC.Record.toMany('XM.AddressCharacteristic', {
    isNested: true,
    inverse: 'address',
    label: '_characteristics'.loc()
  })

};
