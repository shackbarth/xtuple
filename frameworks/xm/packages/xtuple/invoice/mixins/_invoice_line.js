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
    isRequired: true
  }),

  /**
    @type Number
  */
  lineNumber: SC.Record.attr(Number, {
    isRequired: true
  }),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  itemNumber: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    defaultValue: -1
  }),

  /**
    @type String
  */
  customerPartNumber: SC.Record.attr(String),

  /**
    @type Quantity
  */
  ordered: SC.Record.attr(Quantity, {
    isRequired: true
  }),

  /**
    @type Quantity
  */
  billed: SC.Record.attr(Quantity, {
    isRequired: true
  }),

  /**
    @type XM.Unit
  */
  quantityUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type UnitRatio
  */
  quantityUnitRatio: SC.Record.attr(UnitRatio, {
    isRequired: true,
    defaultValue: 1
  }),

  /**
    @type SalesPrice
  */
  price: SC.Record.attr(SalesPrice, {
    isRequired: true
  }),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type UnitRatio
  */
  priceUnitRatio: SC.Record.attr(UnitRatio, {
    isRequired: true,
    defaultValue: 1
  }),

  /**
    @type SalesPrice
  */
  customerPrice: SC.Record.attr(SalesPrice),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType'),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.InvoiceLineTax
  */
  taxes: SC.Record.toMany('XM.InvoiceLineTax', {
    isNested: true,
    inverse: 'invoiceLine'
  })

};
