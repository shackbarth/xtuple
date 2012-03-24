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
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  Name: SC.Record.attr(String, {
    label: '_Name'.loc()
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
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  isReceives1099: SC.Record.attr(Boolean, {
    label: '_isReceives1099'.loc()
  }),

  /**
    @type String
  */
  incoTermsSource: SC.Record.attr(String, {
    label: '_incoTermsSource'.loc()
  }),

  /**
    @type String
  */
  incoTerms: SC.Record.attr(String, {
    label: '_incoTerms'.loc()
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    label: '_terms'.loc()
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    label: '_shipVia'.loc()
  }),

  /**
    @type XM.VendorType
  */
  vendorType: SC.Record.toOne('XM.VendorType', {
    label: '_vendorType'.loc()
  }),

  /**
    @type Boolean
  */
  isQualified: SC.Record.attr(Boolean, {
    label: '_isQualified'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  primaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_primaryContact'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  secondaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_secondaryContact'.loc()
  }),

  /**
    @type XM.AddressInfo
  */
  mainAddress: SC.Record.toOne('XM.AddressInfo', {
    isNested: true,
    label: '_mainAddress'.loc()
  }),

  /**
    @type XM.VendorAddress
  */
  alternateAddresses: SC.Record.toMany('XM.VendorAddress', {
    isNested: true,
    inverse: 'vendor',
    label: '_alternateAddresses'.loc()
  }),

  /**
    @type Boolean
  */
  isMatch: SC.Record.attr(Boolean, {
    label: '_isMatch'.loc()
  }),

  /**
    @type Boolean
  */
  isAchEnabled: SC.Record.attr(Boolean, {
    label: '_isAchEnabled'.loc()
  }),

  /**
    @type String
  */
  achAccountType: SC.Record.attr(String, {
    label: '_achAccountType'.loc()
  }),

  /**
    @type Boolean
  */
  isAchUseVendorInfo: SC.Record.attr(Boolean, {
    label: '_isAchUseVendorInfo'.loc()
  }),

  /**
    @type String
  */
  achIndividualNumber: SC.Record.attr(String, {
    label: '_achIndividualNumber'.loc()
  }),

  /**
    @type String
  */
  achIndividualName: SC.Record.attr(String, {
    label: '_achIndividualName'.loc()
  }),

  /**
    @type String
  */
  achRoutingNumber: SC.Record.attr(String, {
    label: '_achRoutingNumber'.loc()
  }),

  /**
    @type String
  */
  achAccountNumber: SC.Record.attr(String, {
    label: '_achAccountNumber'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type XM.VendorTaxRegistration
  */
  taxRegistrations: SC.Record.toMany('XM.VendorTaxRegistration', {
    isNested: true,
    inverse: 'vendor',
    label: '_taxRegistrations'.loc()
  }),

  /**
    @type XM.VendorComment
  */
  comments: SC.Record.toMany('XM.VendorComment', {
    isNested: true,
    inverse: 'vendor',
    label: '_comments'.loc()
  })

};
