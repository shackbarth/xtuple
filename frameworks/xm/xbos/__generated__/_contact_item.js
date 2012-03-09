// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ContactItem
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ContactItem = XM.Record.extend(
  /** @scope XM.ContactItem.prototype */ {
  
  className: 'XM.ContactItem',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
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
    @type XM.Comment
  */
  source: SC.Record.toOne('XM.Comment'),

  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

});
