// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt');

/**
  @class

  @extends XM._CashReceipt
  @extends XM.Document
*/
XM.CashReceipt = XM.Document.extend(XM._CashReceipt,
  /** @scope XM.CashReceipt.prototype */ {

  numberPolicy: XM.AUTO_NUMBER
  
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

