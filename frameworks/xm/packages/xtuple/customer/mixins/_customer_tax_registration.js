// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerTaxRegistration
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerTaxRegistration = {
  /** @scope XM.CustomerTaxRegistration.prototype */
  
  className: 'XM.CustomerTaxRegistration',

  

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
  vendor: SC.Record.toOne('XM.Vendor'),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority'),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type Date
  */
  effective: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

};
