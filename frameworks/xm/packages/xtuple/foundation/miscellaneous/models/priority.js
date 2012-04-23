// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_priority');

/**
  @class

  @extends XM.Document
*/
XM.Priority = XM.Document.extend(XM._Priority,
  /** @scope XM.Priority.prototype */ {

  documentKey: 'name',

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Returns color code based on the order value.
    
    @type String
  */
  color: function() {
    var order = this.get('order'),
        K = XM.Priority;
    switch (order) {
      case K.VERY_HIGH:
        ret = XT.ERROR;
        break;
      case K.HIGH:
        ret = XT.WARNING;
        break;
      case K.LOW:
        ret = XT.EMPHASIS;
        break;
      case K.VERY_LOW:
        ret = XT.ALTERNATE_EMPHASIS;
        break;
      default:
        ret = 'black';
    }
    return ret;
  }.property('order').cacheable(),

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
  @default 0
*/
  VERY_HIGH: 0,

/**
  High
  
  @static
  @constant
  @type Number
  @default 1
*/
  HIGH: 1,

/**
  Normal
  
  @static
  @constant
  @type Number
  @default 2
*/
  NORMAL: 2,

/**
  Low
  
  @static
  @constant
  @type Number
  @default 3
*/
  LOW: 3,

/**
  Very Low
  
  @static
  @constant
  @type Number
  @default 4
*/
  VERY_LOW: 4

});
