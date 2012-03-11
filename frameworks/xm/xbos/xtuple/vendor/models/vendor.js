// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_vendor');
sc_require('mixins/document');

/**
  @class

  @extends XM._Vendor
  @extends XM.AccountDocument
*/
XM.Vendor = XM._Vendor.extend(XM.Document,
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

