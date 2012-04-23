// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_to_do');


/**
  @class

  @extends XT.Record
*/
XM.ToDo = XT.Record.extend(XM._ToDo, XM.Documents,
  /** @scope XM.ToDo.prototype */ {
    
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Returns the status as a localized string.
    
    @type String
  */
  toDoStatusString: function() {
    var toDoStatus = this.get('toDoStatus'),
        K = XM.ToDo, ret;
    switch (toDoStatus) {
      case K.PENDING:
        ret = "_pending".loc();
        break;
      case K.DEFERRED:
        ret = "_deferred".loc();
        break;
      case K.NEITHER:
        ret = "_neither".loc();
        break;
      case K.IN_PROCESS:
        ret = "_inProcess".loc();
        break;
      case K.COMPLETED:
        ret = "_completed".loc();
        break;
      default:
        ret = "_error".loc();
    }
    return ret;
  }.property('toDoStatus').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});


XM.ToDo.mixin( /** @scope XM.ToDo */ {

/**
  Pending status for To-Do.
  
  @static
  @constant
  @type String
  @default P
*/
  PENDING: 'P',

/**
  Deffered status for To-Do.
  
  @static
  @constant
  @type String
  @default D
*/
  DEFERRED: 'D',

/**
  Open status for To-Do. Neither Pending or Deferred.
  @static
  @constant
  @type String
  @default N
*/
  NEITHER: 'N',

/**
  In-progress status for To-Do (startDate entered and status is NOT 'P' or 'D').
  @static
  @constant
  @type String
  @default I
*/
  IN_PROCESS: 'I',

/**
  Completed status for To-Do (completeDate is entered).
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'

});
