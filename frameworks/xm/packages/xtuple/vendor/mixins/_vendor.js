// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Vendor
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Vendor = {
  /** @scope XM.Vendor.prototype */
  
  className: 'XM.Vendor',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainVendors",
      "read": "ViewVendors",
      "update": "MaintainVendors",
      "delete": "MaintainVendors"
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
  number: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isReceives1099: SC.Record.attr(Boolean),

  /**
    @type String
  */
  incoTermsSource: SC.Record.attr(String),

  /**
    @type String
  */
  incoTerms: SC.Record.attr(String),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String),

  /**
    @type XM.VendorType
  */
  vendorType: SC.Record.toOne('XM.VendorType'),

  /**
    @type Boolean
  */
  isQualified: SC.Record.attr(Boolean),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type XM.ContactInfo
  */
  primaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.ContactInfo
  */
  secondaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.AddressInfo
  */
  mainAddress: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  }),

  /**
    @type XM.VendorAddress
  */
  alternateAddresses: SC.Record.toMany('XM.VendorAddress', {
    isNested: true,
    inverse: 'vendor'
  }),

  /**
    @type Boolean
  */
  isMatch: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isAchEnabled: SC.Record.attr(Boolean),

  /**
    @type String
  */
  achAccountType: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAchUseVendorInfo: SC.Record.attr(Boolean),

  /**
    @type String
  */
  achIndividualNumber: SC.Record.attr(String),

  /**
    @type String
  */
  achIndividualName: SC.Record.attr(String),

  /**
    @type String
  */
  achRoutingNumber: SC.Record.attr(String),

  /**
    @type String
  */
  achAccountNumber: SC.Record.attr(String),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.VendorTaxRegistration
  */
  taxRegistrations: SC.Record.toMany('XM.VendorTaxRegistration', {
    isNested: true,
    inverse: 'vendor'
  }),

  /**
    @type XM.VendorComment
  */
  comments: SC.Record.toMany('XM.VendorComment', {
    isNested: true,
    inverse: 'vendor'
  })

};
