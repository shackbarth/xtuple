// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FinancialLayout
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._FinancialLayout = {
  /** @scope XM.FinancialLayout.prototype */
  
  className: 'XM.FinancialLayout',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainFinancialLayouts",
      "read": "MaintainFinancialLayouts",
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
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  layoutType: SC.Record.attr(String, {
    label: '_layoutType'.loc()
  }),

  /**
    @type XM.FinancialLayoutGroup
  */
  groups: SC.Record.toMany('XM.FinancialLayoutGroup', {
    isNested: true,
    inverse: 'financialLayout',
    label: '_groups'.loc()
  }),

  /**
    @type XM.FinancialLayoutItem
  */
  items: SC.Record.toMany('XM.FinancialLayoutItem', {
    isNested: true,
    inverse: 'financialLayout',
    label: '_items'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  showTotal: SC.Record.attr(Boolean, {
    label: '_showTotal'.loc()
  }),

  /**
    @type Boolean
  */
  isShowBeginning: SC.Record.attr(Boolean, {
    label: '_isShowBeginning'.loc()
  }),

  /**
    @type Boolean
  */
  isShowEnding: SC.Record.attr(Boolean, {
    label: '_isShowEnding'.loc()
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
  isShowBudget: SC.Record.attr(Boolean, {
    label: '_isShowBudget'.loc()
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
  isShowCustom: SC.Record.attr(Boolean, {
    label: '_isShowCustom'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateBeginning: SC.Record.attr(Boolean, {
    label: '_isAlternateBeginning'.loc()
  }),

  /**
    @type String
  */
  beginningLabel: SC.Record.attr(String, {
    label: '_beginningLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateEnding: SC.Record.attr(Boolean, {
    label: '_isAlternateEnding'.loc()
  }),

  /**
    @type String
  */
  endingLabel: SC.Record.attr(String, {
    label: '_endingLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateDebits: SC.Record.attr(Boolean, {
    label: '_isAlternateDebits'.loc()
  }),

  /**
    @type String
  */
  debitsLabel: SC.Record.attr(String, {
    label: '_debitsLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateCredits: SC.Record.attr(Boolean, {
    label: '_isAlternateCredits'.loc()
  }),

  /**
    @type String
  */
  creditsLabel: SC.Record.attr(String, {
    label: '_creditsLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateBudget: SC.Record.attr(Boolean, {
    label: '_isAlternateBudget'.loc()
  }),

  /**
    @type String
  */
  budgetLabel: SC.Record.attr(String, {
    label: '_budgetLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateDifference: SC.Record.attr(Boolean, {
    label: '_isAlternateDifference'.loc()
  }),

  /**
    @type String
  */
  differenceLabel: SC.Record.attr(String, {
    label: '_differenceLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateTotal: SC.Record.attr(Boolean, {
    label: '_isAlternateTotal'.loc()
  }),

  /**
    @type String
  */
  totalLabel: SC.Record.attr(String, {
    label: '_totalLabel'.loc()
  }),

  /**
    @type String
  */
  customLabel: SC.Record.attr(String, {
    label: '_customLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean, {
    label: '_isSystem'.loc()
  })

};
