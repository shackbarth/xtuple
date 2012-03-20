// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_authority');

/**
  @class

  @extends XM.Document
*/
XM.TaxAuthority = XM.Document.extend(XM._TaxAuthority,
  /** @scope XM.TaxAuthority.prototype */ {
 
  numberPolicySetting: 'CRMAccountNumberGeneration'
  
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

