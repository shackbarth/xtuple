// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.InvoiceLine
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._InvoiceLine = {
  /** @scope XM.InvoiceLine.prototype */
  
  className: 'XM.InvoiceLine',

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
    @type XM.Invoice
  */
  invoice: SC.Record.toOne('XM.Invoice', {
    label: '_invoice'.loc()
  }),

  /**
    @type Number
  */
  lineNumber: SC.Record.attr(Number, {
    label: '_lineNumber'.loc()
  }),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true,
    label: '_item'.loc()
  }),

  /**
    @type String
  */
  itemNumber: SC.Record.attr(String, {
    label: '_itemNumber'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    defaultValue: -1,
    label: '_salesCategory'.loc()
  }),

  /**
    @type String
  */
  customerPartNumber: SC.Record.attr(String, {
    label: '_customerPartNumber'.loc()
  }),

  /**
    @type Number
  */
  ordered: SC.Record.attr(Number, {
    label: '_ordered'.loc()
  }),

  /**
    @type Number
  */
  billed: SC.Record.attr(Number, {
    label: '_billed'.loc()
  }),

  /**
    @type XM.Unit
  */
  quantityUnit: SC.Record.toOne('XM.Unit', {
    label: '_quantityUnit'.loc()
  }),

  /**
    @type Number
  */
  quantityUnitRatio: SC.Record.attr(Number, {
    label: '_quantityUnitRatio'.loc()
  }),

  /**
    @type Number
  */
  price: SC.Record.attr(Number, {
    label: '_price'.loc()
  }),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit', {
    label: '_priceUnit'.loc()
  }),

  /**
    @type Number
  */
  priceUnitRatio: SC.Record.attr(Number, {
    label: '_priceUnitRatio'.loc()
  }),

  /**
    @type Number
  */
  customerPrice: SC.Record.attr(Number, {
    label: '_customerPrice'.loc()
  }),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType', {
    label: '_taxType'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.InvoiceLineTax
  */
  taxes: SC.Record.toMany('XM.InvoiceLineTax', {
    isNested: true,
    inverse: 'invoiceLine',
    label: '_taxes'.loc()
  })

};
