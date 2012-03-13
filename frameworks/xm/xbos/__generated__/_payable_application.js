// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PayableApplication
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._PayableApplication = XM.Record.extend(
  /** @scope XM.PayableApplication.prototype */ {
  
  className: 'XM.PayableApplication',

  nestedRecordNamespace: XM,

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
    @type Date
  */
  postDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  sourceDocumentType: SC.Record.attr(String),

  /**
    @type String
  */
  sourceDocumentNumber: SC.Record.attr(String),

  /**
    @type XM.Payable
  */
  source: SC.Record.toOne('XM.Payable', {
    isNested: true
  }),

  /**
    @type String
  */
  targetDocumentType: SC.Record.attr(String),

  /**
    @type String
  */
  targetDocumentNumber: SC.Record.attr(String),

  /**
    @type XM.Payable
  */
  target: SC.Record.toOne('XM.Payable', {
    isNested: true
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
    @type String
  */
  createdBy: SC.Record.attr(String)

});
