// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_terms');

/**
  @class

  @extends XM.Document
*/
XM.Terms = XM.Document.extend(XM._Terms,
  /** @scope XM.Terms.prototype */ {

  documentKey: 'code',

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


XM.Terms.mixin( /** @scope XM.Terms */ {

// Terms Type values
/**
  Days
  
  @static
  @constant
  @type String
  @default D
*/
  DAYS: 'D',

/**
  Proximo
  
  @static
  @constant
  @type String
  @default P
*/
  PROXIMO: 'P'

});
