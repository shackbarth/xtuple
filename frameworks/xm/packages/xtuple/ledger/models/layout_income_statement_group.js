// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_layout_income_statement_group');
sc_require('mixins/layout_financial_statement');

/**
  @class

  @extends XT.Record
*/
XM.LayoutIncomeStatementGroup = XT.Record.extend(XM._LayoutIncomeStatementGroup, XM.LayoutFinancialStatement,
  /** @scope XM.LayoutIncomeStatementGroup.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  statusDidChange: function() {
    var status = this.get('status');

    /**
      Make sure labels' isEditable property is 
      synced with the associated boolean flag
      condition.
    */
    if(status === SC.Record.READY_NEW || status === SC.Record.READY_CLEAN) {
      this.isShowSubtotalDidChange();
      this.isAlternateSubtotalDidChange();
    }
  }.observes('status'),

  isShowSubtotalDidChange: function() {
    var isShowSubtotal = this.get('isShowSubtotal');

    this.set('isShowDifference', isShowSubtotal);
    this.set('isShowBudget', isShowSubtotal);
    if(!isShowSubtotal) this.set('isAlternateSubtotal', isShowSubtotal);
    this.isAlternateSubtotal.set('isEditable', isShowSubtotal);
  }.observes('isShowSubtotal'),

  isAlternateSubtotalDidChange: function() {
    var isAlternateSubtotal = this.get('isAlternateSubtotal');

    this.alternateSubtotalLabel.set('isEditable', isAlternateSubtotal);
  }.observes('isAlternateSubtotal'),

  isSummarizeDidChange: function() {
    var isSummarize = this.get('isSummarize'),
        isShowSubtotal = this.get('isShowSubtotal');

    if(isSummarize) this.set('isAlternateSubtotal', false);
    this.isShowSubtotal.set('isEditable', !isSummarize);
    if(!isShowSubtotal) {
      this.set('isShowDifference', isSummarize);
      this.set('isShowBudget', isSummarize);
    } else {
      this.isAlternateSubtotal.set('isEditable', false);
    }
  }.observes('isSummarize'),

});
