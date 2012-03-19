// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_voucher');
sc_require('mixins/document');

/**
  @class

  @extends XM._Voucher
  @extends XM.Document
*/
XM.Voucher = XM._Voucher.extend(XM.Document,
  /** @scope XM.Voucher.prototype */ {

  numberPolicy: XM.AUTO_NUMBER,
  
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

