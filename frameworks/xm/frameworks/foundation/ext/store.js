// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require("mixins/logging");

/** @class
*/
XM.Store = SC.Store.extend(XM.Logging,
  /** @scope XM.Store.prototype */ {

  //............................................
  // METHODS
  //

  /**
    Dispatch a call to the node datasource to process a function.

    @param {XM.Dispatch} dispatch The dispatch object to send.
    @returns {SC.Store} receiver
  */
  dispatch: function(dispatch) {
    if (!dispatch) throw new Error("dispatch() requires a dispatch");
    var source = this._getDataSource();
    if (source && source.dispatch)
      source.dispatch.call(source, this, dispatch);
    return this;
  },
  
  /**
    Called by a data source when a dispatch result has been returned.  Passing an
    optional id will remap the `storeKey` to the new record id. This is
    required when you commit a record that does not have an id yet.

    @param {XM.Dispatch} dispatch The dispatch originally called.
    @param {Hash} dataHash The result hash.
    @returns {SC.Store} receiver
  */
  dataSourceDidDispatch: function(dispatch, result) {
    var target = dispatch.get('target'),
        action = dispatch.get('action');
    action.call(target, null, result);
  },
  
  /**
    Called by your data source if it encountered an error dispatching a 
    function call. This will put the query into an error state until you try to refresh it
    again.

    @param {XM.Dispatch} dispatch The dispatch that generated
      the error.
    @param {SC.Error} [error] SC.Error instance to associate with 
      the query.
    @returns {SC.Store} receiver
  */
  dataSourceDidErrorDispatch: function(dispatch, error) {
    var errors = this.dispatchErrors;

    // Add the error to the array of dispatch errors 
    // (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.dispatchErrors = {};
      errors[SC.guidFor(dispatch)] = error;
      dispatch.callback(error);
    }
    return this;
  },
  
  /**
    Reimplemented from SC.Store. 
    
    Removes parents updating children
    with parent status when we don't need or want that behavior.
  */
  writeDataHash: function(storeKey, hash, status) {

    // update dataHashes and optionally status.
    if (hash) this.dataHashes[storeKey] = hash;
    if (status) this.statuses[storeKey] = status ;

    // also note that this hash is now editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1 ; // use number for dense array support

    var that = this;

    return this ;
  },
  
  /**
    Reimplemented from SC.Store. 
    
    Eliminates redudant status updates.
  */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    var status = this.readStatus(storeKey), K = SC.Record, statusOnly;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }

    // otherwise, determine proper state transition
    if(status===K.BUSY_DESTROYING) {
      throw K.BAD_STATE_ERROR ;
    } else status = K.READY_CLEAN ;

    this.writeStatus(storeKey, status) ;
    if (dataHash) this.writeDataHash(storeKey, dataHash, status) ;
    if (newId) SC.Store.replaceIdFor(storeKey, newId);

    statusOnly = dataHash || newId ? false : true;
    this.dataHashDidChange(storeKey, null, statusOnly);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);

    //update callbacks
    this._retreiveCallbackForStoreKey(storeKey);

    return this ;
  },


});

