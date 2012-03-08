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
XM._ReceivableApplication = XM.Record.extend(
  /** @scope XM._ReceivableApplication.prototype */ {
  
  className: 'XM.ReceivableApplication',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAROpenItems",
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
    @type Date
  */
  postDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    isNested: true
  }),

  /**
    @type String
  */
  documentType: SC.Record.attr(String),

  /**
    @type String
  */
  documentNumber: SC.Record.attr(String),

  /**
    @type String
  */
  documentTargetType: SC.Record.attr(String),

  /**
    @type String
  */
  fundsType: SC.Record.attr(String),

  /**
    @type String
  */
  referenceNumber: SC.Record.attr(String),

  /**
    @type Number
  */
  applied: SC.Record.attr(Number),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type XM.Receivable
  */
  source: SC.Record.toOne('XM.Receivable'),

  /**
    @type XM.Receivable
  */
  target: SC.Record.toOne('XM.Receivable'),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
