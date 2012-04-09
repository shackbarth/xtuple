// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

// PLACE ME IN ../client/frameworks/xm/packages/xtuple/ledger/models

sc_require('mixins/_layout_income_statement_group');

/**
  @class

  @extends XM.Record
*/
XM.LayoutIncomeStatementGroup = XT.Record.extend(XM._LayoutIncomeStatementGroup,
  /** @scope XM.LayoutIncomeStatementGroup.prototype */ {

  layoutGroupRecords: [],

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  getLayoutGroupRecords: function() {
    var layoutGroupRec = this.get('layoutIncomeStatementGroup');

    while(layoutGroupRec) {
      console.log("group id: " + layoutGroupRec.get('id'));
      console.log("next group id: " + layoutGroupRec.get('layoutIncomeStatementGroup'));
      this.layoutGroupRecords.push(layoutGroupRec);
      layoutGroupRec = layoutGroupRec.get('layoutIncomeStatementGroup');
      console.log("post-assignment");
    }
  },

  //..................................................
  // OBSERVERS
  //

  layoutIncomeStatementGroupDidChange: function() {
    this.getLayoutGroupRecords();
  }.observes('layoutIncomeStatementGroup', 'status'),

});
