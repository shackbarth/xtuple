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
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String, {
    label: '_documentType'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_documentDate'.loc()
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_dueDate'.loc()
  }),

  /**
    @type XM.CustomerInfo
  */
  customer: SC.Record.toOne('XM.CustomerInfo', {
    isNested: true,
    label: '_customer'.loc()
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    label: '_terms'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type Number
  */
  paid: SC.Record.attr(Number, {
    label: '_paid'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    label: '_isPosted'.loc()
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    label: '_salesRep'.loc()
  }),

  /**
    @type String
  */
  orderNumber: SC.Record.attr(String, {
    label: '_orderNumber'.loc()
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
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    isNested: true,
    label: '_salesCategory'.loc()
  }),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number, {
    label: '_commission'.loc()
  }),

  /**
    @type Boolean
  */
  isCommissionPaid: SC.Record.attr(Boolean, {
    label: '_isCommissionPaid'.loc()
  }),

  /**
    @type Boolean
  */
  discount: SC.Record.attr(Boolean, {
    label: '_discount'.loc()
  }),

  /**
    @type Date
  */
  isOpen: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_isOpen'.loc()
  }),

  /**
    @type Date
  */
  closeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_closeDate'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
