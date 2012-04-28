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
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  orderNumber: SC.Record.attr(String, {
    label: '_orderNumber'.loc()
  }),

  /**
    @type Date
  */
  orderDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    },
    label: '_orderDate'.loc()
  }),

  /**
    @type Date
  */
  invoiceDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString('%Y-%m-%d');
    },
    label: '_invoiceDate'.loc()
  }),

  /**
    @type Date
  */
  shipDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_shipDate'.loc()
  }),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false,
    label: '_isPrinted'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false,
    label: '_isPosted'.loc()
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isVoid'.loc()
  }),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    isRequired: true,
    label: '_customer'.loc()
  }),

  /**
    @type String
  */
  billtoName: SC.Record.attr(String, {
    label: '_billtoName'.loc()
  }),

  /**
    @type String
  */
  billtoAddress1: SC.Record.attr(String, {
    label: '_billtoAddress1'.loc()
  }),

  /**
    @type String
  */
  billtoAddress2: SC.Record.attr(String, {
    label: '_billtoAddress2'.loc()
  }),

  /**
    @type String
  */
  billtoAddress3: SC.Record.attr(String, {
    label: '_billtoAddress3'.loc()
  }),

  /**
    @type String
  */
  billtoCity: SC.Record.attr(String, {
    label: '_billtoCity'.loc()
  }),

  /**
    @type String
  */
  billtoState: SC.Record.attr(String, {
    label: '_billtoState'.loc()
  }),

  /**
    @type String
  */
  billtoPostalCode: SC.Record.attr(String, {
    label: '_billtoPostalCode'.loc()
  }),

  /**
    @type String
  */
  billtoCountry: SC.Record.attr(String, {
    label: '_billtoCountry'.loc()
  }),

  /**
    @type String
  */
  billtoContactPhone: SC.Record.attr(String, {
    label: '_billtoContactPhone'.loc()
  }),

  /**
    @type XM.CustomerShiptoInfo
  */
  shipto: SC.Record.toOne('XM.CustomerShiptoInfo', {
    isNested: true,
    label: '_shipto'.loc()
  }),

  /**
    @type String
  */
  shiptoName: SC.Record.attr(String, {
    label: '_shiptoName'.loc()
  }),

  /**
    @type String
  */
  shiptoAddress1: SC.Record.attr(String, {
    label: '_shiptoAddress1'.loc()
  }),

  /**
    @type String
  */
  shiptoAddress2: SC.Record.attr(String, {
    label: '_shiptoAddress2'.loc()
  }),

  /**
    @type String
  */
  shiptoAddress3: SC.Record.attr(String, {
    label: '_shiptoAddress3'.loc()
  }),

  /**
    @type String
  */
  shiptoCity: SC.Record.attr(String, {
    label: '_shiptoCity'.loc()
  }),

  /**
    @type String
  */
  shiptoState: SC.Record.attr(String, {
    label: '_shiptoState'.loc()
  }),

  /**
    @type String
  */
  shiptoPostalCode: SC.Record.attr(String, {
    label: '_shiptoPostalCode'.loc()
  }),

  /**
    @type String
  */
  shiptoCountry: SC.Record.attr(String, {
    label: '_shiptoCountry'.loc()
  }),

  /**
    @type String
  */
  shiptoContactPhone: SC.Record.attr(String, {
    label: '_shiptoContactPhone'.loc()
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    label: '_salesRep'.loc()
  }),

  /**
    @type Percent
  */
  commission: SC.Record.attr(Percent, {
    isRequired: true,
    defaultValue: 0,
    label: '_commission'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    label: '_terms'.loc()
  }),

  /**
    @type String
  */
  purchaseOrderNumber: SC.Record.attr(String, {
    label: '_purchaseOrderNumber'.loc()
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    label: '_shipVia'.loc()
  }),

  /**
    @type String
  */
  incoTerms: SC.Record.attr(String, {
    label: '_incoTerms'.loc()
  }),

  /**
    @type XM.ShipCharge
  */
  shipCharge: SC.Record.toOne('XM.ShipCharge', {
    label: '_shipCharge'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
    defaultValue: function() {
      return XM.Currency.BASE;
    },
    label: '_currency'.loc()
  }),

  /**
    @type Money
  */
  freight: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0,
    label: '_freight'.loc()
  }),

  /**
    @type XM.InvoiceCredit
  */
  credits: SC.Record.toMany('XM.InvoiceCredit', {
    isNested: true,
    inverse: 'invoice',
    label: '_credits'.loc()
  }),

  /**
    @type XM.InvoiceLine
  */
  lines: SC.Record.toMany('XM.InvoiceLine', {
    isNested: true,
    inverse: 'invoice',
    label: '_lines'.loc()
  }),

  /**
    @type XM.InvoiceTaxFreight
  */
  freightTaxes: SC.Record.toMany('XM.InvoiceTaxFreight', {
    isNested: true,
    inverse: 'invoice',
    label: '_freightTaxes'.loc()
  }),

  /**
    @type XM.InvoiceTaxAdjustment
  */
  adjustmentTaxes: SC.Record.toMany('XM.InvoiceTaxAdjustment', {
    isNested: true,
    inverse: 'invoice',
    label: '_adjustmentTaxes'.loc()
  }),

  /**
    @type XM.InvoiceRecurrence
  */
  recurrences: SC.Record.toMany('XM.InvoiceRecurrence', {
    label: '_recurrences'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
