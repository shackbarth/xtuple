// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LayoutIncomeStatementGroup
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._LayoutIncomeStatementGroup = {
  /** @scope XM.LayoutIncomeStatementGroup.prototype */
  
  className: 'XM.LayoutIncomeStatementGroup',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainFinancialLayouts",
      "read": "ViewFinancialLayouts",
      "update": "MaintainFinancialLayouts",
      "delete": "MaintainFinancialLayouts"
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
    @type XM.LayoutIncomeStatement
  */
  layoutIncomeStatement: SC.Record.toOne('XM.LayoutIncomeStatement'),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  layoutIncomeStatementGroup: SC.Record.toOne('XM.LayoutIncomeStatementGroup'),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isShowSubtotal: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type Boolean
  */
  isAlternateSubtotal: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type String
  */
  alternateSubtotalLabel: SC.Record.attr(String),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentLayoutIncomeStatementGroup: SC.Record.toOne('XM.FinancialLayoutGroup'),

  /**
    @type Boolean
  */
  isSummarize: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isSubtract: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBudget: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBudgetPercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDifference: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDifferencePercent: SC.Record.attr(Boolean)

};
