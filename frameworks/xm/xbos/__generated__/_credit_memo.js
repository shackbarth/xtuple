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
XM._CreditMemo = XM.Record.extend(
  /** @scope XM._CreditMemo.prototype */ {
  
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
  number: SC.Record.attr(String),

  /**
    @type String
  */
  invoiceNumber: SC.Record.attr(String),

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
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer'),

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
    @type XM.CustomerShipto
  */
  shipto: SC.Record.toOne('XM.CustomerShipto'),

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
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toMany('XM.ReasonCode', {
    isNested: true,
    inverse: 'guid'
  }),

  /**
    @type String
  */
  PurchaseOrderNumber: SC.Record.attr(String),

  /**
    @type Number
  */
  currency: SC.Record.attr(Number),

  /**
    @type Number
  */
  freight: SC.Record.attr(Number),

  /**
    @type XM.CreditMemoLine
  */
  lines: SC.Record.toMany('XM.CreditMemoLine', {
    isNested: true,
    inverse: 'creditMemo'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
