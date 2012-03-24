// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VendorTaxRegistration
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._VendorTaxRegistration = {
  /** @scope XM.VendorTaxRegistration.prototype */
  
  className: 'XM.VendorTaxRegistration',

  

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
    @type XM.Vendor
  */
  vendor: SC.Record.toOne('XM.Vendor', {
    label: '_vendor'.loc()
  }),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority', {
    label: '_taxAuthority'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type Date
  */
  effective: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_effective'.loc()
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_expires'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
