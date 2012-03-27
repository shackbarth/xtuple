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
  vendor: SC.Record.toOne('XM.Vendor', {
    label: '_vendor'.loc()
  }),

  /**
    @type Date
  */
  postDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_postDate'.loc()
  }),

  /**
    @type String
  */
  sourceDocumentType: SC.Record.attr(String, {
    label: '_sourceDocumentType'.loc()
  }),

  /**
    @type String
  */
  sourceDocumentNumber: SC.Record.attr(String, {
    label: '_sourceDocumentNumber'.loc()
  }),

  /**
    @type XM.Payable
  */
  source: SC.Record.toOne('XM.Payable', {
    isNested: true,
    label: '_source'.loc()
  }),

  /**
    @type String
  */
  targetDocumentType: SC.Record.attr(String, {
    label: '_targetDocumentType'.loc()
  }),

  /**
    @type String
  */
  targetDocumentNumber: SC.Record.attr(String, {
    label: '_targetDocumentNumber'.loc()
  }),

  /**
    @type XM.Payable
  */
  target: SC.Record.toOne('XM.Payable', {
    isNested: true,
    label: '_target'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
