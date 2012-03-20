// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_ship_charge');
sc_require('mixins/document');

/**
  @class

  @extends XM._ShipCharge
*/
XM.ShipCharge = XM._ShipCharge.extend(XM.Document,
  /** @scope XM.ShipCharge.prototype */ {

  // see document mixin for object behavior(s)
  documentKey = 'name',

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
