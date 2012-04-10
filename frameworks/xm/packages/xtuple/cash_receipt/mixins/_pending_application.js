// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.PendingApplication
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._PendingApplication = {
  /** @scope XM.PendingApplication.prototype */
  
  className: 'XM.PendingApplication',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "false",
      "read": "true",
      "update": "false",
      "delete": "false"
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
  pendingApplicationType: SC.Record.attr(String, {
    label: '_pendingApplicationType'.loc()
  }),

  /**
    @type XM.CashReceiptReceivable
  */
  receivable: SC.Record.toOne('XM.CashReceiptReceivable', {
    label: '_receivable'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  })

};
