// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VendorAddress
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._VendorAddress = XM.Record.extend(
  /** @scope XM.VendorAddress.prototype */ {
  
  className: 'XM.VendorAddress',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainVendorAddresses",
      "read": "ViewVendorAddresses",
      "update": "MaintainVendorAddresses",
      "delete": "MaintainVendorAddresses"
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
    @type XM.Vendor
  */
  vendor: SC.Record.toOne('XM.Vendor'),

  /**
    @type String
  */
  code: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  })

});
