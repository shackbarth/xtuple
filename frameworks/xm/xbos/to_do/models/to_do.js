// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_to_do');

/**
  @class

  @extends XM._ToDo
  @extends XM.CoreDocuments
*/
XM.ToDo = XM._ToDo.extend( XM.CoreDocuments,
  /** @scope XM.ToDo.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
  @type String
  */
  toDoStatus: SC.Record.attr(String, {
    /** @private */
    defaultValue: function() {
      return XM.ToDo.NEITHER
    }
  }),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  /* @private */
  _toDosLength: 0,
  
  /* @private */
  _toDosLengthBinding: '.toDos.length',
  
  /* @private */
  _toDosDidChange: function() {
    var documents = this.get('documents'),
        toDos = this.get('toDos');

    documents.addEach(toDos);    
  }.observes('toDosLength')
  
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
  @default O
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
  Completed status for To-Do.
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'

});

