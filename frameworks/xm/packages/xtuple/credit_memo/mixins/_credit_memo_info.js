// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CreditMemoInfo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CreditMemoInfo = {
  /** @scope XM.CreditMemoInfo.prototype */
  
  className: 'XM.CreditMemoInfo',

  

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
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  })

};
