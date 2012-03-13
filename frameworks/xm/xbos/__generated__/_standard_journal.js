// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.StandardJournal
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._StandardJournal = XM.Record.extend(
  /** @scope XM.StandardJournal.prototype */ {
  
  className: 'XM.StandardJournal',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainStandardJournals",
      "read": "MaintainStandardJournals",
      "update": "MaintainStandardJournals",
      "delete": "MaintainStandardJournals"
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
  name: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d'
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.StandardJournalItem
  */
  items: SC.Record.toMany('XM.StandardJournalItem', {
    isNested: true,
    inverse: 'standardJournal'
  })

});
