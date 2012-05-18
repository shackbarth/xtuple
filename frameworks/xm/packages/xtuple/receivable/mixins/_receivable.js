// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Receivable
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Receivable = {
  /** @scope XM.Receivable.prototype */
  
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
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    isRequired: true
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String, {
    isRequired: true
  }),

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
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toOne('XM.ReasonCode', {
    isRequired: true,
    defaultValue: -1
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    isRequired: true,
    defaultValue: -1
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    isRequired: true
  }),

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
    @type Number
  */
  currencyRate: SC.Record.attr(Number),

  /**
    @type XM.ReceivableTaxAdjustment
  */
  adjustmentTaxes: SC.Record.toMany('XM.ReceivableTaxAdjustment', {
    isNested: true,
    inverse: 'receivable'
  }),

  /**
    @type Money
  */
  commissionDue: SC.Record.attr(Money, {
    isRequired: true,
    defaultValue: 0
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.ReceivableApplication
  */
  applications: SC.Record.toMany('XM.ReceivableApplication', {
    isNested: true,
    inverse: 'receivable'
  }),

  /**
    @type Boolean
  */
  isOpen: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type Date
  */
  closeDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    defaultValue: function() {
      return XT.session.details.username;
    }
  })

};
