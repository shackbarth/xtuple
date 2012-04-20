// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ExpenseCategory
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ExpenseCategory = {
  /** @scope XM.ExpenseCategory.prototype */
  
  className: 'XM.ExpenseCategory',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainExpenseCategories",
      "read": true,
      "update": "MaintainExpenseCategories",
      "delete": "MaintainExpenseCategories"
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
  code: SC.Record.attr(String, {
    isRequired: true,
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  })

};
