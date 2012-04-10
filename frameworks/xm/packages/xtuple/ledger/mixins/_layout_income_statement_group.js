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
  layoutIncomeStatement: SC.Record.toOne('XM.LayoutIncomeStatement', {
    label: '_layoutIncomeStatement'.loc()
  }),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  layoutIncomeStatementGroup: SC.Record.toOne('XM.LayoutIncomeStatementGroup', {
    label: '_layoutIncomeStatementGroup'.loc()
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
    @type Boolean
  */
  isShowSubtotal: SC.Record.attr(Boolean, {
    label: '_isShowSubtotal'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateSubtotal: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isAlternateSubtotal'.loc()
  }),

  /**
    @type String
  */
  alternateSubtotalLabel: SC.Record.attr(String, {
    label: '_alternateSubtotalLabel'.loc()
  }),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentLayoutIncomeStatementGroup: SC.Record.toOne('XM.FinancialLayoutGroup', {
    label: '_percentLayoutIncomeStatementGroup'.loc()
  }),

  /**
    @type Boolean
  */
  isSummarize: SC.Record.attr(Boolean, {
    label: '_isSummarize'.loc()
  }),

  /**
    @type Boolean
  */
  isSubtract: SC.Record.attr(Boolean, {
    label: '_isSubtract'.loc()
  }),

  /**
    @type Boolean
  */
  isShowBudget: SC.Record.attr(Boolean, {
    label: '_isShowBudget'.loc()
  }),

  /**
    @type Boolean
  */
  isShowBudgetPercent: SC.Record.attr(Boolean, {
    label: '_isShowBudgetPercent'.loc()
  }),

  /**
    @type Boolean
  */
  isShowDifference: SC.Record.attr(Boolean, {
    label: '_isShowDifference'.loc()
  }),

  /**
    @type Boolean
  */
  isShowDifferencePercent: SC.Record.attr(Boolean, {
    label: '_isShowDifferencePercent'.loc()
  })

};
