// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerShipto
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerShipto = {
  /** @scope XM.CustomerShipto.prototype */
  
  className: 'XM.CustomerShipto',

  nestedRecordNamespace: XM,

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
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    label: '_customer'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type Boolean
  */
  isDefault: SC.Record.attr(Boolean, {
    label: '_isDefault'.loc()
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    label: '_salesRep'.loc()
  }),

  /**
    @type Percent
  */
  commission: SC.Record.attr(Percent, {
    label: '_commission'.loc()
  }),

  /**
    @type XM.ShipZone
  */
  shipZone: SC.Record.toOne('XM.ShipZone', {
    label: '_shipZone'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    label: '_shipVia'.loc()
  }),

  /**
    @type XM.ShipCharge
  */
  shipCharge: SC.Record.toOne('XM.ShipCharge', {
    label: '_shipCharge'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_contact'.loc()
  }),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true,
    label: '_address'.loc()
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
  shippingNotes: SC.Record.attr(String, {
    label: '_shippingNotes'.loc()
  })

};
