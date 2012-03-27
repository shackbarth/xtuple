// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.InvoiceLineTax
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._InvoiceLineTax = {
  /** @scope XM.InvoiceLineTax.prototype */
  
  className: 'XM.InvoiceLineTax',

  

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
    @type XM.InvoiceLine
  */
  invoiceLine: SC.Record.toOne('XM.InvoiceLine', {
    label: '_invoiceLine'.loc()
  }),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType', {
    label: '_taxType'.loc()
  }),

  /**
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode', {
    label: '_taxCode'.loc()
  }),

  /**
    @type Number
  */
  basis: SC.Record.attr(Number, {
    label: '_basis'.loc()
  }),

  /**
    @type XM.TaxCode
  */
  basisTaxCode: SC.Record.toOne('XM.TaxCode', {
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
    useIsoDate: false,
    label: '_documentDate'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  })

};
