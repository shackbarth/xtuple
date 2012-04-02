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
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String, {
    isRequired: true,
    label: '_documentType'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true,
    label: '_documentDate'.loc()
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true,
    label: '_dueDate'.loc()
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
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    isRequired: true,
    defaultValue: -1,
    label: '_terms'.loc()
  }),

  /**
    @type XM.Money
  */
  amount: SC.Record.attr('XM.Money', {
    isRequired: true,
    label: '_amount'.loc()
  }),

  /**
    @type XM.Money
  */
  paid: SC.Record.attr('XM.Money', {
    label: '_paid'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
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
  reasonCode: SC.Record.toOne('XM.ReasonCode', {
    isRequired: true,
    defaultValue: -1,
    label: '_reasonCode'.loc()
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    isRequired: true,
    defaultValue: -1,
    label: '_salesCategory'.loc()
  }),

  /**
    @type XM.Percent
  */
  commission: SC.Record.attr('XM.Percent', {
    isRequired: true,
    defaultValue: 0,
    label: '_commission'.loc()
  }),

  /**
    @type Boolean
  */
  isCommissionPaid: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isCommissionPaid'.loc()
  }),

  /**
    @type Date
  */
  isOpen: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: true,
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
