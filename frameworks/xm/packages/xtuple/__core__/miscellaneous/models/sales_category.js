// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/miscellaneous/mixins/_sales_category');

/**
  @class

  @extends XM.Document
*/
XM.SalesCategory = XM.Document.extend(XM._SalesCategory,
  /** @scope XM.SalesCategory.prototype */ {

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

});
