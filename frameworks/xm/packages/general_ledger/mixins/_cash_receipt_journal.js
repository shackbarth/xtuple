// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CashReceiptJournal
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CashReceiptJournal = {
  /** @scope XM.CashReceiptJournal.prototype */
  
  className: 'XM.CashReceiptJournal',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewJournals",
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
  date: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_date'.loc()
  }),

  /**
    @type Number
  */
  series: SC.Record.attr(Number, {
    label: '_series'.loc()
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
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_ledgerAccount'.loc()
  }),

  /**
    @type String
  */
  sense: SC.Record.attr(String, {
    label: '_sense'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type Boolean
  */
  journal: SC.Record.attr(Boolean, {
    label: '_journal'.loc()
  }),

  /**
    @type String
  */
  created: SC.Record.attr(String, {
    label: '_created'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  })

};
