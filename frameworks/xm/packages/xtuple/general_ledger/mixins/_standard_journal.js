// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.StandardJournal
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._StandardJournal = {
  /** @scope XM.StandardJournal.prototype */
  
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
  name: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.StandardJournalItem
  */
  items: SC.Record.toMany('XM.StandardJournalItem', {
    isNested: true,
    inverse: 'standardJournal',
    label: '_items'.loc()
  })

};
