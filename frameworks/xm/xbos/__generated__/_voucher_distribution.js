// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._VoucherDistribution = XM.Record.extend(
  /** @scope XM._VoucherDistribution.prototype */ {
  
  className: 'XM.VoucherDistribution',

  

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
    @type XM.Voucher
  */
  voucher: SC.Record.toOne('XM.Voucher'),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number),

  /**
    @type Number
  */
  quantity: SC.Record.attr(Number),

  /**
    @type XM.ExpenseCategory
  */
  expenseCategory: SC.Record.toOne('XM.ExpenseCategory'),

  /**
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode'),

  /**
    @type Boolean
  */
  isDiscountable: SC.Record.attr(Boolean),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
