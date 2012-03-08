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
XM._Receivable = XM.Record.extend(
  /** @scope XM._Receivable.prototype */ {
  
  className: 'XM.Receivable',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainARMemos",
      "read": "ViewARMemos",
      "update": "MaintainARMemos",
      "delete": "MaintainARMemos"
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
  documentType: SC.Record.attr(String),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    isNested: true
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  paid: SC.Record.attr(Number),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type String
  */
  orderNumber: SC.Record.attr(String),

  /**
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toMany('XM.ReasonCode', {
    isNested: true,
    inverse: 'guid'
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    isNested: true
  }),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number),

  /**
    @type Boolean
  */
  isCommissionPaid: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  discount: SC.Record.attr(Boolean),

  /**
    @type Date
  */
  isOpen: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type Date
  */
  closeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
