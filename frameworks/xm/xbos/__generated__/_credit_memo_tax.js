// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CreditMemoTax
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CreditMemoTax = XM.Record.extend(
  /** @scope XM.CreditMemoTax.prototype */ {
  
  className: 'XM.CreditMemoTax',

  

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
    @type XM.CreditMemo
  */
  creditMemo: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type XM.CreditMemo
  */
  taxType: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type XM.CreditMemo
  */
  taxCode: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type Number
  */
  basis: SC.Record.attr(Number),

  /**
    @type XM.CreditMemo
  */
  basisTaxCode: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type Number
  */
  sequence: SC.Record.attr(Number),

  /**
    @type Number
  */
  percent: SC.Record.attr(Number),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  tax: SC.Record.attr(Number),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number)

});
