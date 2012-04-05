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

  setOptions: function() {
    
  },

  //..................................................
  // OBSERVERS
  //

  optionsDidChange: function() {
    var prop = arguments[1];

    switch(prop) {
      case 'isShowTotal':
        if(isShowTotal) {
          this.isAlternateTotal.set('isEditable', true);
        } else {
          this.isAlternateTotal.set('isEditable', false);          
        }
        break;
      case 'isAlternateBudget':
        if(isAlternateBudget) {
          
        } else {
          
        }
        break;
      default:
        if(isAlternateTotal) {
          
        } else {
          
        }
    }
  }.observes('isShowTotal', 'isAlternateBudget', 'isAlternateTotal'),

});

