// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_ship_charge');

/**
  @class

  @extends XM.Document
*/
XM.ShipCharge = XM.Document.extend(XM._ShipCharge,
  /** @scope XM.ShipCharge.prototype */ {

  documentKey: 'name',

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
