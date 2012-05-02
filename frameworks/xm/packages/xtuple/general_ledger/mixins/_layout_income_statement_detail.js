// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LayoutIncomeStatementDetail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._LayoutIncomeStatementDetail = {
  /** @scope XM.LayoutIncomeStatementDetail.prototype */
  
  className: 'XM.LayoutIncomeStatementDetail',

  nestedRecordNamespace: XM,

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
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    isRequired: true
  }),

  /**
    @type String
  */
  company: SC.Record.attr(String),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String),

  /**
    @type String
  */
  accountType: SC.Record.attr(String),

  /**
    @type String
  */
  subType: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSubtract: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBudget: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type Boolean
  */
  isShowBudgetPercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDifference: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type Boolean
  */
  isShowDifferencePercent: SC.Record.attr(Boolean),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  percentlayoutIncomeStatementGroup: SC.Record.toOne('XM.LayoutIncomeStatementGroup'),

  /**
    @type Number
  */
  order: SC.Record.attr(Number)

};
