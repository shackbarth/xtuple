// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_sales_category');
sc_require('mixins/document');

/**
  @class

  @extends XM._SalesCategory
*/
XM.SalesCategory = XM._SalesCategory.extend(XM.Document,
  /** @scope XM.SalesCategory.prototype */ {

  // see document mixin for object behavior(s)
  documentKey = 'name';

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
