// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FinancialLayoutGroup
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._FinancialLayoutGroup = {
  /** @scope XM.FinancialLayoutGroup.prototype */
  
  className: 'XM.FinancialLayoutGroup',

  

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
    @type String
  */
  isAlternateSubtotal: SC.Record.attr(String, {
    label: '_isAlternateSubtotal'.loc()
  }),

  /**
    @type Boolean
  */
  subtotalLabel: SC.Record.attr(Boolean, {
    label: '_subtotalLabel'.loc()
  }),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentFinancialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup', {
    label: '_percentFinancialLayoutGroup'.loc()
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
  })

};
