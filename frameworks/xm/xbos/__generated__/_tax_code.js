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
XM._TaxCode = XM.Record.extend(
  /** @scope XM._TaxCode.prototype */ {
  
  className: 'XM.TaxCode',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTaxCodes",
      "read": "ViewTaxCodes",
      "update": "MaintainTaxCodes",
      "delete": "MaintainTaxCodes"
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
  description: SC.Record.attr(String),

  /**
    @type XM.TaxClass
  */
  taxClass: SC.Record.toOne('XM.TaxClass'),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority'),

  /**
    @type XM.TaxCode
  */
  basisTaxCode: SC.Record.toOne('XM.TaxCode')

});
