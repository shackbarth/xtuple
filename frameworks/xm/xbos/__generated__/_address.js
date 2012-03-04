// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                                
// ==========================================================================
/*globals XM */

/** 
  @class

  This code is automatically generated and will be over-written. Do not edit directly. 

  @extends XM.Record
*/

XM._Address = XM.Record.extend(
/** @scope XM._Address.prototype */ {

  className: 'XM.Address',

  nestedRecordNamespace: XM,

  // ..........................................................
  // PRIVILEGES
  //

  privileges:{
    "all": {
      "create": "MaintainAddresses",
      "read": "ViewAddresses",
      "update": "MaintainAddresses",
      "delete": "MaintainAddresses"
    }
  },

  // ..........................................................
  // ATTRIBUTES
  //
  
  /**
  @type Number
  */
  guid: SC.Record.attr(Number),

  /**
  @type String
  */
  number: SC.Record.attr(String),

  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
  @type String
  */
  line1: SC.Record.attr(String),

  /**
  @type String
  */
  line2: SC.Record.attr(String),

  /**
  @type String
  */
  line3: SC.Record.attr(String),

  /**
  @type String
  */
  city: SC.Record.attr(String),

  /**
  @type String
  */
  state: SC.Record.attr(String),

  /**
  @type String
  */
  postalCode: SC.Record.attr(String),

  /**
  @type String
  */
  country: SC.Record.attr(String),

  /**
  @type String
  */
  notes: SC.Record.attr(String),

  /**
  @type XM.AddressComment
  */
  comments: SC.Record.toMany('XM.AddressComment', {
    isNested: true,
    inverse: 'address'
  }),

  /**
  @type XM.AddressCharacteristic
  */
  characteristics: SC.Record.toMany('XM.AddressCharacteristic', {
    isNested: true,
    inverse: 'address'
  })

});