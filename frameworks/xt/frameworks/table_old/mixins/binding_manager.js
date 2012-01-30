
XT.BindingManager = {

  //........................................
  // Methods

  /** @private */
  initMixin: function() {

    // because initMixin is called AFTER init on the view it
    // becomes ABSOLUTELY WORTHLESS!!!!!! sigh...

    // but, we'll try anyways - if _xt_create_binding has yet to
    // be called go ahead and create the the array so willDestroyLater
    // won't die if none are ever created
    if(!this._xt_bindings) this._xt_bindings = [];

    // need to create a function to run alongside any present willDestroyLater
    // or replace it if none exists
    var dtor;

    // is there one already
    if(this.willDestroyLater) {

      // since there already is one, we need to create a new one that also
      // calls the original
      var self = this, orig = this.willDestroyLater;

      // create a new function that calls both
      dtor = function() { self._xt_bindings_dtor(); orig.call(self); };

      // now assign willDestroyLater to the new overloaded method
      this.willDestroyLater = dtor;
    } else { this.willDestroyLater = this._xt_bindings_dtor; }
  },

  /** @public */
  _xt_create_binding: function(fromPath, fromSource, toPath, toSource) {

    // if this is the first time, create a new array
    if(!this._xt_bindings) this._xt_bindings = [];

    // create and connect the binding
    var bindRef = SC.Binding.from(fromPath, fromSource).to(toPath, toSource).connect();

    // stash the reference to the binding for later recall (for dtor)
    this._xt_bindings.push(bindRef);

    // return the reference to the created binding for manual use
    return bindRef;
  },

  /** @private */
  _xt_bindings_dtor: function() {

    // iterate over each of the binding references and disconnect them
    this._xt_bindings.forEach(function(binding) {
      binding.disconnect();
    });

    // delete the object
    this._xt_bindings = null;
  },

};
