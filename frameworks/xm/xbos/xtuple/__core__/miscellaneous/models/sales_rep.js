// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_sales_rep');
sc_require('mixins/document');

/**
  @class

  @extends XM._SalesRep
*/
XM.SalesRep = XM._SalesRep.extend(XM.Document,
  /** @scope XM.SalesRep.prototype */ {
  
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

