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
    label: '_documentDate'.loc()
  }),

  /**
    @type Date
  */
  dueDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_dueDate'.loc()
  }),

  /**
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms', {
    label: '_terms'.loc()
  }),

  /**
    @type XM.VendorInfo
  */
  vendor: SC.Record.toOne('XM.VendorInfo', {
    label: '_vendor'.loc()
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
    @type Number
  */
  discountAmount: SC.Record.attr(Number, {
    label: '_discountAmount'.loc()
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
  purchaseOrderNumber: SC.Record.attr(String, {
    label: '_purchaseOrderNumber'.loc()
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
  isOpen: SC.Record.attr(Boolean, {
    label: '_isOpen'.loc()
  }),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean, {
    label: '_isPosted'.loc()
  }),

  /**
    @type Boolean
  */
  isDiscount: SC.Record.attr(Boolean, {
    label: '_isDiscount'.loc()
  }),

  /**
    @type String
  */
  reference: SC.Record.attr(String, {
    label: '_reference'.loc()
  }),

  /**
    @type Date
  */
  closeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_closeDate'.loc()
  }),

  /**
    @type String
  */
  payableStatus: SC.Record.attr(String, {
    label: '_payableStatus'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
