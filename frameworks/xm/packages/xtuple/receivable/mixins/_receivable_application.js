// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ReceivableApplication
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ReceivableApplication = {
  /** @scope XM.ReceivableApplication.prototype */
  
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
    format: '%Y-%m-%d',
    label: '_postDate'.loc()
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    isNested: true,
    label: '_customer'.loc()
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
  documentNumber: SC.Record.attr(String, {
    label: '_documentNumber'.loc()
  }),

  /**
    @type String
  */
  documentTargetType: SC.Record.attr(String, {
    label: '_documentTargetType'.loc()
  }),

  /**
    @type String
  */
  fundsType: SC.Record.attr(String, {
    label: '_fundsType'.loc()
  }),

  /**
    @type String
  */
  referenceNumber: SC.Record.attr(String, {
    label: '_referenceNumber'.loc()
  }),

  /**
    @type Number
  */
  applied: SC.Record.attr(Number, {
    label: '_applied'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type XM.Receivable
  */
  source: SC.Record.toOne('XM.Receivable', {
    label: '_source'.loc()
  }),

  /**
    @type XM.Receivable
  */
  target: SC.Record.toOne('XM.Receivable', {
    label: '_target'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
