// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_payable');

/**
  @class

  @extends XT.Record
*/
XM.Payable = XM.Document.extend(XM._Payable,
  /** @scope XM.Payable.prototype */ {

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

