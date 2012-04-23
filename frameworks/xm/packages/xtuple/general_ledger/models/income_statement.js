// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
sc_require('models/financial_statement');
/*globals XM */

/**
  @class

  @extends XM.FinancialStatement
*/
XM.IncomeStatement = XM.FinancialStatement.extend(
  /** @scope XM.IncomeStatement.prototype */ {

  className: 'XM.IncomeStatement',
  
  /**
    @type Money
  */
  quarter: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  quarterPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  quarterBudget: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  quarterBudgetPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  quarterBudgetDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  quarterBudgetDifferencePercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  year: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  yearPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  yearBudget: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  yearBudgetPercent: SC.Record.attr(Percent),
  
  /**
    @type Money
  */
  yearBudgetDifference: SC.Record.attr(Money),
  
  /**
    @type Percent
  */
  yearBudgetDifferencePercent: SC.Record.attr(Percent)

});

XM.IncomeStatement.retrieve = function(columnLayout, period) {
  return false; // TODO: implement this
}

