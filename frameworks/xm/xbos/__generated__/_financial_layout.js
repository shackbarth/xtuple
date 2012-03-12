// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FinancialLayout
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._FinancialLayout = XM.Record.extend(
  /** @scope XM.FinancialLayout.prototype */ {
  
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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  layoutType: SC.Record.attr(String),

  /**
    @type XM.FinancialLayoutGroup
  */
  groups: SC.Record.toMany('XM.FinancialLayoutGroup', {
    isNested: true,
    inverse: 'financialLayout'
  }),

  /**
    @type XM.FinancialLayoutItem
  */
  items: SC.Record.toMany('XM.FinancialLayoutItem', {
    isNested: true,
    inverse: 'financialLayout'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  showTotal: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBeginning: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowEnding: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDebitsCredits: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBudget: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDifference: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowCustom: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isAlternateBeginning: SC.Record.attr(Boolean),

  /**
    @type String
  */
  beginningLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateEnding: SC.Record.attr(Boolean),

  /**
    @type String
  */
  endingLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateDebits: SC.Record.attr(Boolean),

  /**
    @type String
  */
  debitsLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateCredits: SC.Record.attr(Boolean),

  /**
    @type String
  */
  creditsLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateBudget: SC.Record.attr(Boolean),

  /**
    @type String
  */
  budgetLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateDifference: SC.Record.attr(Boolean),

  /**
    @type String
  */
  differenceLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateTotal: SC.Record.attr(Boolean),

  /**
    @type String
  */
  totalLabel: SC.Record.attr(String),

  /**
    @type String
  */
  customLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean)

});
