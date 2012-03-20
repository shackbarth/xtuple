// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_tax_authority');
sc_require('mixins/document');

/**
  @class

  @extends XM._TaxAuthority
*/
XM.TaxAuthority = XM._TaxAuthority.extend(XM.Document,
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

