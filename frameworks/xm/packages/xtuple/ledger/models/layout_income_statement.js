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

  init: function() {
    arguments.callee.base.apply(this, arguments);

    /**
      sync option labels' isEditable properties with 
      associated boolean flag's default state
    */
    this.budgetLabel.set('isEditable', false);
    this.isAlternateTotal.set('isEditable', false);
    this.alternateTotalLabel.set('isEditable', false);
  },

  /**
    when an income statement option flag changes state, 
    keep all associated options properties in sync
  */
  setOptions: function(key) {
    switch(key) {
      case 'isShowTotal':
        var isShowTotal = this.get('isShowTotal');

        if(isShowTotal) {
          this.isAlternateTotal.set('isEditable', true);
        } else {
          this.set('isAlternateTotal', false);
          this.isAlternateTotal.set('isEditable', false);
        }
        break;
      case 'isAlternateBudget':
        var isAlternateBudget = this.get('isAlternateBudget');

        if(isAlternateBudget) {
          this.budgetLabel.set('isEditable', true);
        } else {
          this.budgetLabel.set('isEditable', false);
        }
        break;

      /**
        case isAlternateTotal:
      */
      default:
        var isAlternateTotal = this.get('isAlternateTotal');

        if(isAlternateTotal) {
          this.alternateTotalLabel.set('isEditable', true);
        } else {
          this.alternateTotalLabel.set('isEditable', false);
        }
    }
  },

  //..................................................
  // OBSERVERS
  //

  /**
    call setOptions() when an associated boolean flag changes
  */
  optionsDidChange: function() {
    var prop = arguments[1];

    this.setOptions(prop);
  }.observes('isShowTotal', 'isAlternateBudget', 'isAlternateTotal'),

});

