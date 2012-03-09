// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxAuthority
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._TaxAuthority = XM.Record.extend(
  /** @scope XM.TaxAuthority.prototype */ {
  
  className: 'XM.TaxAuthority',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTaxAuthorities",
      "read": "ViewTaxAuthorities",
      "update": "MaintainTaxAuthorities",
      "delete": "MaintainTaxAuthorities"
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
  code: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  externalReference: SC.Record.attr(String),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type String
  */
  county: SC.Record.attr(String),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  })

});
