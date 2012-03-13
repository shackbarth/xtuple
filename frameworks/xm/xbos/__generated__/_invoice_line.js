// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.InvoiceLine
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._InvoiceLine = XM.Record.extend(
  /** @scope XM.InvoiceLine.prototype */ {
  
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
  invoice: SC.Record.toOne('XM.Invoice'),

  /**
    @type Number
  */
  lineNumber: SC.Record.attr(Number),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true
  }),

  /**
    @type XM.SiteInfo
  */
  site: SC.Record.toOne('XM.SiteInfo', {
    isNested: true
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory'),

  /**
    @type String
  */
  customerPartNumber: SC.Record.attr(String),

  /**
    @type Number
  */
  ordered: SC.Record.attr(Number),

  /**
    @type Number
  */
  billed: SC.Record.attr(Number),

  /**
    @type XM.Unit
  */
  quantityUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Number
  */
  quantityUnitRatio: SC.Record.attr(Number),

  /**
    @type Number
  */
  price: SC.Record.attr(Number),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Number
  */
  priceUnitRatio: SC.Record.attr(Number),

  /**
    @type Number
  */
  customerPrice: SC.Record.attr(Number),

  /**
    @type XM.InvoiceLineTax
  */
  taxes: SC.Record.toMany('XM.InvoiceLineTax', {
    isNested: true,
    inverse: 'invoiceLine'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
