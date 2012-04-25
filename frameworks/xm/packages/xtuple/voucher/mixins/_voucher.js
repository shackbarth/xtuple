// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Voucher
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Voucher = {
  /** @scope XM.Voucher.prototype */
  
  className: 'XM.Voucher',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainVouchers",
      "read": "ViewVouchers",
      "update": "MaintainVouchers",
      "delete": "MaintainVouchers"
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
    @type XM.Vendor
  */
  vendor: SC.Record.toOne('XM.Vendor', {
    isNested: true,
    label: '_vendor'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    label: '_isPosted'.loc()
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
    @type Boolean
  */
  isFlagFor1099: SC.Record.attr(Boolean, {
    label: '_isFlagFor1099'.loc()
  }),

  /**
    @type String
  */
  reference: SC.Record.attr(String, {
    label: '_reference'.loc()
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    label: '_terms'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType', {
    label: '_taxType'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.VoucherRecurrence
  */
  recurrences: SC.Record.toMany('XM.VoucherRecurrence', {
    label: '_recurrences'.loc()
  })

};
