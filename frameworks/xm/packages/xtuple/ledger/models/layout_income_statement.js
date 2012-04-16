// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_layout_income_statement');

/**
  @class

  @extends XM.Document
*/
XM.LayoutIncomeStatement = XM.Document.extend(XM._LayoutIncomeStatement,
  /** @scope XM.LayoutIncomeStatement.prototype */ {

  documentKey: 'name',

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /**
    when an income statement 'options' flag changes state, 
    keep all associated options properties in sync
  */
  isShowTotalDidChange: function() {
    var isShowTotal = this.get('isShowTotal');
    if(!isShowTotal) this.set('isAlternateTotal', isShowTotal);
    this.isAlternateTotal.set('isEditable', isShowTotal);
  }.observes('isShowTotal'),

  isAlternateBudgetDidChange: function() {
    var isAlternateBudget = this.get('isAlternateBudget');

    this.budgetLabel.set('isEditable', isAlternateBudget);
  }.observes('isAlternateBudget'),

  isAlternateTotalDidChange: function() {
    var isAlternateTotal = this.get('isAlternateTotal');

    this.alternateTotalLabel.set('isEditable', isAlternateTotal);
  }.observes('isAlternateTotal'),

  statusDidChange: function() {
    var status = this.get('status');

    /**
      sync 'options' labels' isEditable properties with 
      associated boolean flag's default state
    */
    if(status === SC.Record.READY_NEW) {
      this.isShowTotalDidChange();
      this.isAlternateBudgetDidChange();
    }
  }.observes('status'),

});
