// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_class');

/**
  @class

  @extends XM.Document
*/
XM.TaxClass = XM.Document.extend(XM._TaxClass,
  /** @scope XM.TaxClass.prototype */ {

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

