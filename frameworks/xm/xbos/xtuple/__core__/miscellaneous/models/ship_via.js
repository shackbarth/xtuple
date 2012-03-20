// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_ship_via');
sc_require('mixins/document');

/**
  @class

  @extends XM._ShipVia
*/
XM.ShipVia = XM._ShipVia.extend(XM.Document,
  /** @scope XM.ShipVia.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  // see document mixin for object behavior(s)
  documentKey = 'code';

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  validate: function() {
    return arguments.callee.base.apply(this, arguments);
  }.observes('code')

});

