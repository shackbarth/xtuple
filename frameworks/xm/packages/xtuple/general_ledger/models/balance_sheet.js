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
XM.BalanceSheet = XM.FinancialStatement.extend(
  /** @scope XM.BalanceSheet.prototype */ {
  
  className: 'XM.BalanceSheet'
  
});

XM.BalanceSheet.retrieve = function(columnLayout, period) {
  return false; // TODO: implement this
}

