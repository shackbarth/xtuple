// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LedgerAccountInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._LedgerAccountInfo = {
  /** @scope XM.LedgerAccountInfo.prototype */
  
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
  company: SC.Record.attr(String, {
    label: '_company'.loc()
  }),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String, {
    label: '_profitCenter'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String, {
    label: '_subAccount'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
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
  accountType: SC.Record.attr(String, {
    label: '_accountType'.loc()
  })

};
