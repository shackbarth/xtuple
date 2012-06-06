// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_to_do_info');
sc_require('models/to_do');

/**
  @class

  @extends XT.Record
*/
XM.ToDoInfo = XT.Record.extend(XM._ToDoInfo,
  /** @scope XM.ToDoInfo.prototype */ {

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

