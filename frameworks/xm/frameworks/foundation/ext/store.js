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

  registerChildToParent: function(parentStoreKey, childStoreKey, path){
    var prs, crs, oldPk, oldChildren, pkRef, rec;
    // Check the child to see if it has a parent
    crs = this.childRecords || {};
    prs = this.parentRecords || {};
    // first rid of the old parent
    oldPk = crs[childStoreKey];
    if (oldPk && oldPk === parentStoreKey) return;
    else if (oldPk){
      oldChildren = prs[oldPk];
      delete oldChildren[childStoreKey];
      // this.recordDidChange(null, null, oldPk, key);
    }
    pkRef = prs[parentStoreKey] || {};
    pkRef[childStoreKey] = path || true;
    prs[parentStoreKey] = pkRef;
    crs[childStoreKey] = parentStoreKey;
    rec = this.records[childStoreKey]; 
    if (rec) rec.notifyPropertyChange('status');
    this.childRecords = crs;
    this.parentRecords = prs;
  },
  
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


});

// XM.set('store', XM.Store.create().from('XM.DataSource'));
