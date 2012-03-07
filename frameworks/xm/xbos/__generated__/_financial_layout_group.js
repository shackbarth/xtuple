// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._FinancialLayoutGroup = XM.Record.extend(
  /** @scope XM._FinancialLayoutGroup.prototype */ {
  
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
  financialLayout: SC.Record.toOne('XM.FinancialLayout'),

  /**
    @type XM.FinancialLayoutGroup
  */
  financialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup'),

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
  isShowSubtotal: SC.Record.attr(Boolean),

  /**
    @type String
  */
  isAlternateSubtotal: SC.Record.attr(String),

  /**
    @type Boolean
  */
  subtotalLabel: SC.Record.attr(Boolean),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentFinancialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup'),

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
  isShowBeginningBalance: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowBeginningPercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowEndEndingBalance: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowEndingPercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDebitsCredits: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowDebitsCreditsPercent: SC.Record.attr(Boolean),

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
  isShowDifferencePercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowCustom: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShowCustomPercent: SC.Record.attr(Boolean)

});
