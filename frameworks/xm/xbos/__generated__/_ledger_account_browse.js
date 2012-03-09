// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LedgerAccountBrowse
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._LedgerAccountBrowse = XM.Record.extend(
  /** @scope XM.LedgerAccountBrowse.prototype */ {
  
  className: 'XM.LedgerAccountBrowse',

  

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
  company: SC.Record.attr(String),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  type: SC.Record.attr(String)

});
