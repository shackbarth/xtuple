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
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    isRequired: true,
    label: '_ledgerAccount'.loc()
  }),

  /**
    @type String
  */
  company: SC.Record.attr(String, {
    label: '_company'.loc()
  }),

  /**
    @type String
  */
  profitCenter: SC.Record.attr(String, {
    label: '_profitCenter'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  subAccount: SC.Record.attr(String, {
    label: '_subAccount'.loc()
  }),

  /**
    @type String
  */
  accountType: SC.Record.attr(String, {
    label: '_accountType'.loc()
  }),

  /**
    @type String
  */
  subType: SC.Record.attr(String, {
    label: '_subType'.loc()
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
    defaultValue: true,
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
    defaultValue: true,
    label: '_isShowDifference'.loc()
  }),

  /**
    @type Boolean
  */
  isShowDifferencePercent: SC.Record.attr(Boolean, {
    label: '_isShowDifferencePercent'.loc()
  }),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  percentlayoutIncomeStatementGroup: SC.Record.toOne('XM.LayoutIncomeStatementGroup', {
    label: '_percentlayoutIncomeStatementGroup'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    label: '_order'.loc()
  })

};
