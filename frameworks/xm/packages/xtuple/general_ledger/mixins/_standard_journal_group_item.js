// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.StandardJournalGroupItem
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._StandardJournalGroupItem = {
  /** @scope XM.StandardJournalGroupItem.prototype */
  
  className: 'XM.StandardJournalGroupItem',

  

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
    @type XM.StandardJournalGroup
  */
  standardJournalGroup: SC.Record.toOne('XM.StandardJournalGroup'),

  /**
    @type XM.StandardJournal
  */
  standardJournal: SC.Record.toOne('XM.StandardJournal'),

  /**
    @type Number
  */
  apply: SC.Record.attr(Number),

  /**
    @type Date
  */
  effective: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  })

};
