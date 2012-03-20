// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_to_do');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM.Record
*/
XM.ToDo = XM.Record.extend(XM._ToDo, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.ToDo.prototype */ {
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  // see document mixin for object behavior(s)
  documentKey: 'name',

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  /* @private */
  toDosLength: 0,
  
  /* @private */
  toDosLengthBinding: '*toDos.length',
  
  /* @private */
  validate: function() {
    return arguments.callee.base.apply(this, arguments);
  }.observes('name', 'dueDate', 'assignedTo'),
  
  _xm_assignedToDidChange: function() {
    var assignedTo = this.get('assignedTo'),
        status = this.get('status');
     
    if(status & SC.Record.READY && assignedTo) this.set('assignDate', SC.DateTime.create());
  }.observes('assignedTo'),
  
  /* @private */
  _xm_toDosDidChange: function() {
    var documents = this.get('documents'),
        toDos = this.get('toDos');

    documents.addEach(toDos);    
  }.observes('toDosLength'),

  /**
    @private

    If startDate is entered and toDoStatus is 'N' the toDoStatus is changed to 'I' (in-progress).

    If completeDate is entered the toDoStaus is changed to 'C' (complete).
  */
  statusDidChange: function() {
    var status = this.get('status'),
        _toDoStatus = this.get('toDoStatus'),
        _startDate = this.get('startDate'),
        _completeDate = this.get('completeDate');
    if(status & SC.Record.READY) {
      if(_completeDate && _toDoStatus != XM.ToDo.COMPLETED) this.set('toDoStatus', XM.ToDo.COMPLETED);
      else if(_startDate && _toDoStatus === XM.ToDo.NEITHER) this.set('toDoStatus', XM.ToDo.INPROGRESS);
    }
  }.observes('toDoStatus', 'startDate', 'completeDate')
  
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
  INPROGRESS: 'I',

/**
  Completed status for To-Do (completeDate is entered).
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'

});
