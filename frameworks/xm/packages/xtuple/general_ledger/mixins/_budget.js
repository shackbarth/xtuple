// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Budget
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Budget = {
  /** @scope XM.Budget.prototype */
  
  className: 'XM.Budget',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainBudgets",
      "read": "MaintainBudgets",
      "update": "MaintainBudgets",
      "delete": "MaintainBudgets"
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
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.BudgetDetail
  */
  items: SC.Record.toMany('XM.BudgetDetail', {
    inverse: 'budget'
  })

};
