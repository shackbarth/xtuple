// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ReceivableTaxAdjustment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ReceivableTaxAdjustment = {
  /** @scope XM.ReceivableTaxAdjustment.prototype */
  
  className: 'XM.ReceivableTaxAdjustment',

  

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
    @type XM.Receivable
  */
  receivable: SC.Record.toOne('XM.Receivable'),

  /**
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode'),

  /**
    @type Number
  */
  sequence: SC.Record.attr(Number),

  /**
    @type Money
  */
  tax: SC.Record.attr(Money),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  })

};
