// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Invoice
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Invoice = {
  /** @scope XM.Invoice.prototype */
  
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
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  orderNumber: SC.Record.attr(String),

  /**
    @type Date
  */
  orderDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    }
  }),

  /**
    @type Date
  */
  invoiceDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    }
  }),

  /**
    @type Date
  */
  shipDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    isRequired: true
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
  billtoContactPhone: SC.Record.attr(String),

  /**
    @type XM.CustomerShiptoInfo
  */
  shipto: SC.Record.toOne('XM.CustomerShiptoInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  shiptoName: SC.Record.attr(String),

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
  shiptoContactPhone: SC.Record.attr(String),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type Percent
  */
  commission: SC.Record.attr(Percent, {
    isRequired: true,
    defaultValue: 0
  }),

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
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
    defaultValue: function() {
      return XM.Currency.BASE;
    }
  }),

  /**
    @type Money
  */
  freight: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0
  }),

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
    @type XM.InvoiceTaxFreight
  */
  freightTaxes: SC.Record.toMany('XM.InvoiceTaxFreight', {
    isNested: true,
    inverse: 'invoice'
  }),

  /**
    @type XM.InvoiceTaxAdjustment
  */
  adjustmentTaxes: SC.Record.toMany('XM.InvoiceTaxAdjustment', {
    isNested: true,
    inverse: 'invoice'
  }),

  /**
    @type XM.InvoiceRecurrence
  */
  recurrences: SC.Record.toMany('XM.InvoiceRecurrence', {
    inverse: 'invoice'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

};
