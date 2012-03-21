// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/miscellaneous/mixins/_expense_category');

/**
  @class

  @extends XM.Document
*/
XM.ExpenseCategory = XM.Document.extend(XM._ExpenseCategory,
  /** @scope XM.ExpenseCategory.prototype */ {

  documentKey: 'code',

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});
