// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CashReceiptDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CashReceiptDetail = {
  /** @scope XM.CashReceiptDetail.prototype */
  
  className: 'XM.CashReceiptDetail',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "true",
      "read": "true",
      "update": "true",
      "delete": "true"
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
    @type XM.CashReceipt
  */
  cashReceipt: SC.Record.toOne('XM.CashReceipt', {
    isRequired: true,
    label: '_cashReceipt'.loc()
  }),

  /**
    @type XM.Receivable
  */
  receivable: SC.Record.toOne('XM.Receivable', {
    isRequired: true,
    label: '_receivable'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    isRequired: true,
    label: '_amount'.loc()
  }),

  /**
    @type Number
  */
  discount: SC.Record.attr(Number, {
    isRequired: true,
    defaultValue: 0,
    label: '_discount'.loc()
  })

};
