// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class
  
  Abstract financial statement class.

  @extends XT.Record
*/
XM.FinancialStatement = XT.Record.extend(
  /** @scope XM.FinancialStatement.prototype */ {

  className: 'XM.FinancialStatement',

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewFinancialReports",
      "update": false,
      "delete": false
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
    @type Number
  */
  order: SC.Record.attr(Number),
  
  /**
    @type Number
  */
  level: SC.Record.attr(Number),
  
  /**
    @type Number
  */
  subGroup: SC.Record.attr(Number),

  /**
    @type String
  */
  layoutType: SC.Record.attr(String),

  /**
    @type XM.LedgerAccountInfo
  */
  ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
    isNested: true,
    label: '_ledgerAccount'.loc()
  }),
  
  /**
    @type Money
  */
  month: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  monthPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  monthBudget: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  monthBudgetPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  monthBudgetDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  monthBudgetDifferencePercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  priorMonth: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorMonthPercent: SC.Record.attr(Percent),

  /**
    @type Difference
  */
  priorMonthDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorMonthDifferencePercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  priorQuarter: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorQuarterPercent: SC.Record.attr(Percent),

  /**
    @type Difference
  */
  priorQuarterDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorQuarterDifferencePercent: SC.Record.attr(Percent),

  /**
    @type Money
  */
  priorYear: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorYearPercent: SC.Record.attr(Percent),

  /**
    @type Difference
  */
  priorYearDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  priorYearDifferencePercent: SC.Record.attr(Percent)

});


