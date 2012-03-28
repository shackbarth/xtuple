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
  standardJournalGroup: SC.Record.toOne('XM.StandardJournalGroup', {
    label: '_standardJournalGroup'.loc()
  }),

  /**
    @type XM.StandardJournal
  */
  standardJournal: SC.Record.toOne('XM.StandardJournal', {
    label: '_standardJournal'.loc()
  }),

  /**
    @type Number
  */
  apply: SC.Record.attr(Number, {
    label: '_apply'.loc()
  }),

  /**
    @type Date
  */
  effective: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_effective'.loc()
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_expires'.loc()
  })

};
