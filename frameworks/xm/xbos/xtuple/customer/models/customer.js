// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_customer');
sc_require('mixins/core_documents');
sc_require('mixins/document');


/**
  @class

  @extends XM._Customer
  @extends XM.AccountDocument
  @extends XM.CoreDocuments
*/
XM.Customer = XM._Customer.extend(XM.Document, XM.CoreDocuments,
  /** @scope XM.Customer.prototype */ {

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

