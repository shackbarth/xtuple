// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VoucherDistribution
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._VoucherDistribution = {
  /** @scope XM.VoucherDistribution.prototype */
  
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
  voucher: SC.Record.toOne('XM.Voucher', {
    label: '_voucher'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type Number
  */
  quantity: SC.Record.attr(Number, {
    label: '_quantity'.loc()
  }),

  /**
    @type XM.ExpenseCategory
  */
  expenseCategory: SC.Record.toOne('XM.ExpenseCategory', {
    label: '_expenseCategory'.loc()
  }),

  /**
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode', {
    label: '_taxCode'.loc()
  }),

  /**
    @type Boolean
  */
  isDiscountable: SC.Record.attr(Boolean, {
    label: '_isDiscountable'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
