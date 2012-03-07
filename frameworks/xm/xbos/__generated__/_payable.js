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
XM._Payable = XM.Record.extend(
  /** @scope XM._Payable.prototype */ {
  
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
    @type XM.Terms
  */
  terms: SC.Record.toOne('XM.Terms'),

  /**
    @type XM.VendorInfo
  */
  vendor: SC.Record.toOne('XM.VendorInfo'),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  paid: SC.Record.attr(Number),

  /**
    @type Number
  */
  discountAmount: SC.Record.attr(Number),

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
  purchaseOrderNumber: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isOpen: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isPosted: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isDiscount: SC.Record.attr(Boolean),

  /**
    @type String
  */
  reference: SC.Record.attr(String),

  /**
    @type Date
  */
  closeDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  payableStatus: SC.Record.attr(String),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
