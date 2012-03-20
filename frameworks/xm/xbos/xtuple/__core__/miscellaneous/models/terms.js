// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_terms');
sc_require('mixins/document');

/**
  @class

  @extends XM._Terms
*/
XM.Terms = XM._Terms.extend(XM.Document
  /** @scope XM.Terms.prototype */ {

  // see document mixin for object behavior(s)
  documentKey = 'code',

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
