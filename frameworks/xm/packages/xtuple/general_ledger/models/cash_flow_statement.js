// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
sc_require('models/income_statement');
/*globals XM */

/**
  @class

  @extends XM.IncomeStatement
*/
XM.CashFlowStatement = XM.IncomeStatement.extend(
  /** @scope XM.CashFlowStatement.prototype */ {

  className: 'XM.CashFlowStatement',
  
  /**
    @type Money
  */
  monthDebits: SC.Record.attr(Money),
  
  /**
    @type Money
  */
  monthCredits: SC.Record.attr(Money),
  
  /**
    @type Money
  */
  quarterDebits: SC.Record.attr(Money),
  
  /**
    @type Money
  */
  quarterCredits: SC.Record.attr(Money),
  
  /**
    @type Money
  */
  yearDebits: SC.Record.attr(Money),
  
  /**
    @type Money
  */
  yearCredits: SC.Record.attr(Money)

});

XM.CashFlowStatement.retrieve = function(columnLayout, period) {
  return false; // TODO: implement this
}

