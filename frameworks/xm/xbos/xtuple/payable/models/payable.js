// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_payable');
sc_require('mixins/document');

/**
  @class

  @extends XM._Payable
  @extends XM.Document
*/
XM.Payable = XM._Payable.extend(XM.Document,
  /** @scope XM.Payable.prototype */ {

  numberPolicy: XM.AUTO_OVERRIDE_NUMBER
  
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

