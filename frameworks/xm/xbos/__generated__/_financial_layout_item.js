// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FinancialLayoutItem
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._FinancialLayoutItem = XM.Record.extend(
  /** @scope XM.FinancialLayoutItem.prototype */ {
  
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
  financialLayout: SC.Record.toOne('XM.FinancialLayout'),

  /**
    @type XM.FinancialLayoutGroup
  */
  financialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup'),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true
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
  type: SC.Record.attr(String),

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
  isShowCustomPercent: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  customSource: SC.Record.attr(Boolean),

  /**
    @type XM.FinancialLayoutGroup
  */
  percentFinancialLayoutGroup: SC.Record.toOne('XM.FinancialLayoutGroup'),

  /**
    @type Number
  */
  order: SC.Record.attr(Number)

});
