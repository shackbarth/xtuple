// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FinancialLayoutItem
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._FinancialLayoutItem = {
  /** @scope XM.FinancialLayoutItem.prototype */
  
  className: 'XM.FinancialLayoutItem',

  nestedRecordNamespace: XM,

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
    @type XM.FinancialLayout
  */
  financialLayout: SC.Record.toOne('XM.FinancialLayout', {
    label: '_financialLayout'.loc()
  }),

  /**
    @type XM.FinancialLayoutGroup
  */
  financialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup', {
    label: '_financialLayoutGroup'.loc()
  }),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
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
  isShowBeginningBalance: SC.Record.attr(Boolean, {
    label: '_isShowBeginningBalance'.loc()
  }),

  /**
    @type Boolean
  */
  isShowBeginningPercent: SC.Record.attr(Boolean, {
    label: '_isShowBeginningPercent'.loc()
  }),

  /**
    @type Boolean
  */
  isShowEndEndingBalance: SC.Record.attr(Boolean, {
    label: '_isShowEndEndingBalance'.loc()
  }),

  /**
    @type Boolean
  */
  isShowEndingPercent: SC.Record.attr(Boolean, {
    label: '_isShowEndingPercent'.loc()
  }),

  /**
    @type Boolean
  */
  isShowDebitsCredits: SC.Record.attr(Boolean, {
    label: '_isShowDebitsCredits'.loc()
  }),

  /**
    @type Boolean
  */
  isShowDebitsCreditsPercent: SC.Record.attr(Boolean, {
    label: '_isShowDebitsCreditsPercent'.loc()
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
  }),

  /**
    @type Boolean
  */
  isShowCustom: SC.Record.attr(Boolean, {
    label: '_isShowCustom'.loc()
  }),

  /**
    @type Boolean
  */
  isShowCustomPercent: SC.Record.attr(Boolean, {
    label: '_isShowCustomPercent'.loc()
  }),

  /**
    @type Boolean
  */
  customSource: SC.Record.attr(Boolean, {
    label: '_customSource'.loc()
  }),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentFinancialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup', {
    label: '_percentFinancialLayoutGroup'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    label: '_order'.loc()
  })

};
