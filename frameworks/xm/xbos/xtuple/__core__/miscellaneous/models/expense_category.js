// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_expense_category');
sc_require('mixins/document');

/**
  @class

  @extends XM._ExpenseCategory
*/
XM.ExpenseCategory = XM._ExpenseCategory.extend(XM.Document,
  /** @scope XM.ExpenseCategory.prototype */ {

  // see document mixin for object behavior(s)
  documentKey = 'code',

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
