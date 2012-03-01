/*globals XM */

sc_require("mixins/logging");

/** @class

  @todo REVIEW ME REVIEW ME THIS WAS TAKEN FROM PROTOTYPE!!!

*/
XM.Store = SC.Store.extend(XM.Logging,
  /** @scope XM.Store.prototype */ {

  start: function() {
    this.log("Starting up");
    return YES;
  },

  name: "XM.Store",
  
  /**
    Dispatch a call to the data source to process a function.

    @param {XM.Dispatch} dispatch
    @returns {SC.Store} receiver
  */

  dispatch: function(dispatch) {
    if (!dispatch) throw new Error("dispatch() requires a dispatch");

    var source = this._getDataSource();

    if (source && source.dispatch) {
      source.dispatch.call(source, this, dispatch);
    }

    return this ;
  },
  
  /**
    Called by a data source when a dispatch result has been returned.  Passing an
    optional id will remap the `storeKey` to the new record id.  This is
    required when you commit a record that does not have an id yet.

    @param {Dispatch} dispatch the dispatch originally called
    @param {Hash} dataHash result set
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

    @param {XM.Dispatch} dispatch the dispatch with the error
    @param {SC.Error} error [optional] an SC.Error instance to associate with query
    @returns {SC.Store} receiver
  */
  dataSourceDidErrorDispatch: function(dispatch, error) {
    var errors = this.dispatchErrors;

    // Add the error to the array of dispatch errors (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.dispatchErrors = {};
      errors[SC.guidFor(dispatch)] = error;
      
      dispatch.callback(error);
    }

    return this;
  }

});

XM.set('store', XM.Store.create().from('XM.DataSource'));