// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Payable
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Payable = {
  /** @scope XM.Payable.prototype */
  
  className: 'XM.Payable',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAPMemos",
      "read": "ViewAPMemos",
      "update": "MaintainAPMemos",
      "delete": "MaintainAPMemos"
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
    @type XM.VendorInfo
  */
  vendor: SC.Record.toOne('XM.VendorInfo', {
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
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    isRequired: true,
    defaultValue: -1
  }),

  /**
    @type String
  */
  payableStatus: SC.Record.toOne(String, {
    isRequired: true,
    defaultValue: 'O'
  }),

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
    @type XM.PayableTaxAdjustment
  */
  adjustmentTaxes: SC.Record.toMany('XM.PayableTaxAdjustment', {
    isNested: true,
    inverse: 'payable'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.PayableApplication
  */
  applications: SC.Record.toMany('XM.PayableApplication', {
    isNested: true,
    inverse: 'payable'
  }),

  /**
    @type Date
  */
  isOpen: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
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
      return arguments[0].getPath("store.dataSource").session.userName;
    }
  })

};
