// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Invoice
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Invoice = XM.Record.extend(
  /** @scope XM.Invoice.prototype */ {
  
  className: 'XM.Invoice',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainMiscInvoices",
      "read": "ViewMiscInvoices",
      "update": "MaintainMiscInvoices",
      "delete": "MaintainMiscInvoices"
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
  number: SC.Record.attr(String),

  /**
    @type String
  */
  orderNumber: SC.Record.attr(String),

  /**
    @type Date
  */
  orderDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  invoiceDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  shipDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  billtoName: SC.Record.attr(String),

  /**
    @type String
  */
  billtoAddress1: SC.Record.attr(String),

  /**
    @type String
  */
  billtoAddress2: SC.Record.attr(String),

  /**
    @type String
  */
  billtoAddress3: SC.Record.attr(String),

  /**
    @type String
  */
  billtoCity: SC.Record.attr(String),

  /**
    @type String
  */
  billtoState: SC.Record.attr(String),

  /**
    @type String
  */
  billtoPostalCode: SC.Record.attr(String),

  /**
    @type String
  */
  billtoCountry: SC.Record.attr(String),

  /**
    @type String
  */
  billtoPhone: SC.Record.attr(String),

  /**
    @type XM.CustomerShiptoInfo
  */
  shipto: SC.Record.toOne('XM.CustomerShiptoInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  shiptoAddress1: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoAddress2: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoAddress3: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoCity: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoState: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoPostalCode: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoCountry: SC.Record.attr(String),

  /**
    @type String
  */
  shiptoPhone: SC.Record.attr(String),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type String
  */
  purchaseOrderNumber: SC.Record.attr(String),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String),

  /**
    @type String
  */
  incoTerms: SC.Record.attr(String),

  /**
    @type XM.ShipCharge
  */
  shipCharge: SC.Record.toOne('XM.ShipCharge'),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  freight: SC.Record.attr(Number),

  /**
    @type XM.InvoiceCredit
  */
  credits: SC.Record.toMany('XM.InvoiceCredit', {
    isNested: true,
    inverse: 'invoice'
  }),

  /**
    @type XM.InvoiceLine
  */
  lines: SC.Record.toMany('XM.InvoiceLine', {
    isNested: true,
    inverse: 'invoice'
  }),

  /**
    @type XM.InvoiceTax
  */
  taxes: SC.Record.toMany('XM.InvoiceTax', {
    isNested: true,
    inverse: 'invoice'
  }),

  /**
    @type XM.InvoiceRecurrence
  */
  recurrences: SC.Record.toMany('XM.InvoiceRecurrence'),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
