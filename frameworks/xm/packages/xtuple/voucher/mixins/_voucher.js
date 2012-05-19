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
    isNested: true
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type Date
  */
  documentDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Boolean
  */
  isFlagFor1099: SC.Record.attr(Boolean),

  /**
    @type String
  */
  reference: SC.Record.attr(String),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType'),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.VoucherRecurrence
  */
  recurrences: SC.Record.toMany('XM.VoucherRecurrence', {
    inverse: 'voucher'
  })

};
