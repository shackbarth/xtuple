// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_receivable');

/**
  @class

  @extends XM.Document
*/
XM.Receivable = XM.Document.extend(XM._Receivable,
  /** @scope XM.Receivable.prototype */ {

  numberPolicy: XT.AUTO_OVERRIDE_NUMBER

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

