// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_layout_income_statement_detail');
sc_require('mixins/layout_financial_statement');
sc_require('models/ledger_account');

/**
  @class

  @extends XT.Record
*/
XM.LayoutIncomeStatementDetail = XT.Record.extend(XM._LayoutIncomeStatementDetail, XM.LayoutFinancialStatement,
  /** @scope XM.LayoutIncomeStatementDetail.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  filteredSubAccounts: function() {
    var subAccountTypes = XM.SubAccountType.getTypes(),
        accountType = record.get('accountType'),
        ret;

    ret = function() {
      if(accountType) {
        return subAccountTypes.filterProperty('accountType', accountType);
      } else {
        return subAccountTypes;
      }
    }

    return ret;
  }.property('accountType').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});
