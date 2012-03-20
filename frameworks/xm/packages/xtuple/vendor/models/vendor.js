// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_vendor');

/**
  @class

  @extends XM.Document
*/
XM.Vendor = XM.Document.extend(XM._Vendor,
  /** @scope XM.Vendor.prototype */ {

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

