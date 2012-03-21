// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CreditMemoLineTax
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CreditMemoLineTax = {
  /** @scope XM.CreditMemoLineTax.prototype */
  
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
  creditMemoLine: SC.Record.toOne('XM.CreditMemo', {
    label: '_creditMemoLine'.loc()
  }),

  /**
    @type XM.CreditMemo
  */
  taxType: SC.Record.toOne('XM.CreditMemo', {
    label: '_taxType'.loc()
  }),

  /**
    @type XM.CreditMemo
  */
  taxCode: SC.Record.toOne('XM.CreditMemo', {
    label: '_taxCode'.loc()
  }),

  /**
    @type Number
  */
  basis: SC.Record.attr(Number, {
    label: '_basis'.loc()
  }),

  /**
    @type XM.CreditMemo
  */
  basisTaxCode: SC.Record.toOne('XM.CreditMemo', {
    label: '_basisTaxCode'.loc()
  }),

  /**
    @type Number
  */
  sequence: SC.Record.attr(Number, {
    label: '_sequence'.loc()
  }),

  /**
    @type Number
  */
  percent: SC.Record.attr(Number, {
    label: '_percent'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type Number
  */
  tax: SC.Record.attr(Number, {
    label: '_tax'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_documentDate'.loc()
  }),

  /**
    @type Number
  */
  currency: SC.Record.attr(Number, {
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  })

};
