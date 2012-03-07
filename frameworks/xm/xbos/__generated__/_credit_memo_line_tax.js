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
XM._CreditMemoLineTax = XM.Record.extend(
  /** @scope XM._CreditMemoLineTax.prototype */ {
  
  className: 'XM.CreditMemoLineTax',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
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
  creditMemoLine: SC.Record.toOne('XM.CreditMemo'),

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
    @type Number
  */
  currency: SC.Record.attr(Number),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number)

});
