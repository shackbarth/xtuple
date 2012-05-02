// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PayableApplication
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._PayableApplication = {
  /** @scope XM.PayableApplication.prototype */
  
  className: 'XM.PayableApplication',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAPOpenItems",
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
    @type XM.Vendor
  */
  vendor: SC.Record.toOne('XM.Vendor'),

  /**
    @type XM.Payable
  */
  payable: SC.Record.toOne('XM.Payable'),

  /**
    @type String
  */
  documentType: SC.Record.attr(String),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String),

  /**
    @type Date
  */
  postDate: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type Number
  */
  paid: SC.Record.attr(Number),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

};
