// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LedgerAccountInfo
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._LedgerAccountInfo = XM.Record.extend(
  /** @scope XM.LedgerAccountInfo.prototype */ {
  
  className: 'XM.LedgerAccountInfo',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
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
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  type: SC.Record.attr(String)

});
