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
  customer: SC.Record.toOne('XM.Customer'),

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
    @type Boolean
  */
  isDefault: SC.Record.attr(Boolean),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type Percent
  */
  commission: SC.Record.attr(Percent),

  /**
    @type XM.ShipZone
  */
  shipZone: SC.Record.toOne('XM.ShipZone'),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String),

  /**
    @type XM.ShipCharge
  */
  shipCharge: SC.Record.toOne('XM.ShipCharge'),

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
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type String
  */
  shippingNotes: SC.Record.attr(String)

};
