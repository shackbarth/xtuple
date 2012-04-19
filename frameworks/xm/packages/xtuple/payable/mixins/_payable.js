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
    isRequired: true,
    label: '_vendor'.loc()
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
    @type String
  */
  documentType: SC.Record.attr(String, {
    isRequired: true,
    label: '_documentType'.loc()
  }),

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
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    isRequired: true,
    defaultValue: -1,
    label: '_terms'.loc()
  }),

  /**
    @type String
  */
  payableStatus: SC.Record.toOne(String, {
    isRequired: true,
    defaultValue: 'O',
    label: '_payableStatus'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    isRequired: true,
    label: '_amount'.loc()
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
    @type Number
  */
  currencyRate: SC.Record.attr(Number, {
    label: '_currencyRate'.loc()
  }),

  /**
    @type XM.PayableTaxAdjustment
  */
  adjustmentTaxes: SC.Record.toMany('XM.PayableTaxAdjustment', {
    isNested: true,
    inverse: 'payable',
    label: '_adjustmentTaxes'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.PayableApplication
  */
  applications: SC.Record.toMany('XM.PayableApplication', {
    isNested: true,
    inverse: 'payable',
    label: '_applications'.loc()
  }),

  /**
    @type Date
  */
  isOpen: SC.Record.attr(Boolean, {
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
    defaultValue: function() {
      return arguments[0].getPath("store.dataSource").session.userName;
    },
    label: '_createdBy'.loc()
  })

};
