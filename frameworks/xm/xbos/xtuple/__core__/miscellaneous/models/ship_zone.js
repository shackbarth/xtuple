// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_ship_zone');
sc_require('mixins/document');

/**
  @class

  @extends XM._ShipZone
*/
XM.ShipZone = XM._ShipZone.extend(XM.Document
  /** @scope XM.ShipZone.prototype */ {

  // see document mixin for object behavior(s)
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

