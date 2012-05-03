// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.StandardJournalItem
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._StandardJournalItem = {
  /** @scope XM.StandardJournalItem.prototype */
  
  className: 'XM.StandardJournalItem',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
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
    @type XM.StandardJournal
  */
  standardJournal: SC.Record.toOne('XM.StandardJournal'),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

};
