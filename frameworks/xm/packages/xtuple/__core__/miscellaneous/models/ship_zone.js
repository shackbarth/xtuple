// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/miscellaneous/mixins/_ship_zone');

/**
  @class

  @extends XM.Document
*/
XM.ShipZone = XM.Document.extend(XM._ShipZone,
  /** @scope XM.ShipZone.prototype */ {

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

