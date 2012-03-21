// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CreditMemo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CreditMemo = {
  /** @scope XM.CreditMemo.prototype */
  
  className: 'XM.CreditMemo',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCreditMemos",
      "read": "ViewCreditMemos",
      "update": "MaintainCreditMemos",
      "delete": "MaintainCreditMemos"
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
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  invoiceNumber: SC.Record.attr(String, {
    label: '_invoiceNumber'.loc()
  }),

  /**
    @type Boolean
  */
  isPrinted: SC.Record.attr(Boolean, {
    label: '_isPrinted'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    label: '_isPosted'.loc()
  }),

  /**
    @type Boolean
  */
  isVoid: SC.Record.attr(Boolean, {
    label: '_isVoid'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_documentDate'.loc()
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
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
    @type XM.CustomerShipto
  */
  shipto: SC.Record.toOne('XM.CustomerShipto', {
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
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    label: '_salesRep'.loc()
  }),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number, {
    label: '_commission'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toMany('XM.ReasonCode', {
    isNested: true,
    inverse: 'guid',
    label: '_reasonCode'.loc()
  }),

  /**
    @type String
  */
  PurchaseOrderNumber: SC.Record.attr(String, {
    label: '_PurchaseOrderNumber'.loc()
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
  freight: SC.Record.attr(Number, {
    label: '_freight'.loc()
  }),

  /**
    @type XM.CreditMemoLine
  */
  lines: SC.Record.toMany('XM.CreditMemoLine', {
    isNested: true,
    inverse: 'creditMemo',
    label: '_lines'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
