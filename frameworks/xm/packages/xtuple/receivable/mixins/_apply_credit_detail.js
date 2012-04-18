// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ApplyCreditDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ApplyCreditDetail = {
  /** @scope XM.ApplyCreditDetail.prototype */
  
  className: 'XM.ApplyCreditDetail',

  

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
    @type XM.ApplyCredit
  */
  applyCredit: SC.Record.toOne('XM.ApplyCredit', {
    label: '_applyCredit'.loc()
  }),

  /**
    @type XM.ApplyCreditReceivable
  */
  receivable: SC.Record.attr('XM.ApplyCreditReceivable', {
    label: '_receivable'.loc()
  }),

  /**
    @type Money
  */
  amount: SC.Record.attr(Money, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  })

};
