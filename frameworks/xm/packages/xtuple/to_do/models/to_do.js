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
    
  toDoStatusProxy: function() {
    var toDoStatus = this.get('toDoStatus'),
        K = XM.ToDo,
        ret;

    switch (toDoStatus) {
      case K.PENDING:
        ret = K.PENDING;
        break;
      case K.DEFERRED:
        ret = K.DEFERRED;
        break;
      default:
        ret = K.NEITHER;
    }
    return ret;
  }.property('toDoStatus').cacheable(),

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  /**
  init: function() {
    arguments.callee.base.apply(this, arguments);
    var K = XM.ToDo;
    this.set('toDoStatusProxy', K.NEITHER);
  },
  */

  //..................................................
  // OBSERVERS
  //

  /**
    @private

    If startDate is entered and toDoStatusProxy is 'N' the toDoStatus is 'I' (in-progress).

    If completeDate is entered the toDoStaus is 'C' (complete).
  */
  statusDidChange: function() {
    var status = this.get('status'),
        toDoStatus = this.get('toDoStatus'),
        proxy = this.get('toDoStatusProxy'),
        startDate = this.get('startDate'),
        completeDate = this.get('completeDate'),
        K = XM.ToDo;

    if(status & SC.Record.READY) {
      if(completeDate) {
        this.set('toDoStatus', K.COMPLETED);
        this.set('toDoStatusProxy', K.NEITHER);
      } else if(proxy === K.PENDING) {
        this.set('toDoStatus', proxy);
      } else if (proxy === K.DEFERRED) {
        this.set('toDoStatus', proxy);
      } else if (startDate) {
        this.set('toDoStatus', K.IN_PROCESS);
      } else {
        this.set('toDoStatus', K.NEITHER);
      }
    }
  }.observes('toDoStatus', 'toDoStatusProxy', 'startDate', 'completeDate')
  
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
