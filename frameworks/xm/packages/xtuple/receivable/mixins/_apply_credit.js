// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ApplyCredit
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ApplyCredit = {
  /** @scope XM.ApplyCredit.prototype */
  
  className: 'XM.ApplyCredit',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ApplyARMemos",
      "update": false,
      "delete": false
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
    label: '_customer'.loc()
  }),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_documentDate'.loc()
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String, {
    label: '_documentType'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    label: '_amount'.loc()
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
    @type XM.ReceivableApplication
  */
  applications: SC.Record.toMany('XM.ReceivableApplication', {
    isNested: true,
    inverse: 'receivable',
    label: '_applications'.loc()
  }),

  /**
    @type XM.ReceivablePendingApplication
  */
  pendingApplications: SC.Record.toMany('XM.ReceivablePendingApplication', {
    isNested: true,
    inverse: 'receivable',
    label: '_pendingApplications'.loc()
  }),

  /**
    @type XM.ApplyCreditDetail
  */
  details: SC.Record.toMany('XM.ApplyCreditDetail', {
    isNested: true,
    inverse: 'applyCredit',
    label: '_details'.loc()
  })

};
