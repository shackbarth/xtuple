// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_priority');
sc_require('mixins/document');

/**
  @class

  @extends XM._Priority
  @extends XM.Document

*/
XM.Priority = XM._Priority.extend(XM.Document,
  /** @scope XM.Priority.prototype */ {

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

XM.Priority.mixin( /** @scope XM.Priority */ {

// Incident Priority values
/**
  Very High
  
  @static
  @constant
  @type Number
  @default 1
*/
  VERY_HIGH: 1,

/**
  High
  
  @static
  @constant
  @type Number
  @default 2
*/
  HIGH: 2,

/**
  Normal
  
  @static
  @constant
  @type Number
  @default 3
*/
  NORMAL: 3,

/**
  Low
  
  @static
  @constant
  @type Number
  @default 4
*/
  LOW: 4,

/**
  Very Low
  
  @static
  @constant
  @type Number
  @default 5
*/
  VERY_LOW: 5

});
