
/*globals XT */

sc_require("ext/object");

/** @class

*/
XT.Task = XT.Object.extend(
  /** @scope XT.Task.prototype */ {

  //.................................................
  // Properties
  //
  
  /** @property */
  method: null,
  
  /** @property */
  target: null,

  /** @property */
  fail: null,

  /** @property */
  complete: null,

  /** @property */
  wait: NO,

  /** @property */
  hold: NO,

  /** @property */
  status: null,

  /** @property */
  owner: null,

  /** @property */
  context: null,

  /** @property */
  isWaiting: NO,

  //.................................................
  // Public Methods
  //

  /** @public
    The default fire method. Is usuall replaced except
    for on holding tasks. It will create the task once it is
    ready to be executed and then execute it immediately.
  */
  fire: function() {
    var w = this.get("isWaiting");
    if(w && w === YES) {
      var task = this._createTask();
      task.fire();
      return;
    }
  },

  //.................................................
  // Private Methods
  //

  /** @private */
  init: function() {
    sc_super();
    var w = this.get("wait");
    
    // if this request needs to wait we set that here
    // so that it will be processed later
    if(w && w === YES) {
      this.set("isWaiting", YES);
      this.set("wait", null);
      return;
    }

    this._createTask();
  },

  /** @private */
  _createTask: function() {
    var m = this.get("method"),
        t = this.get("target"),
        f = this.get("fail"),
        c = this.get("complete"),
        w = this.get("wait"),
        h = this.get("hold"),
        s = this.get("status"),
        x = this.get("context"),
        o = this.get("owner"), type;  
    
    // if this is a holding task, not much to it
    if(h && SC.typeOf(h) === SC.T_STRING)
      return this._createHold(); 

    // if this is a waiting task for an event, it is
    // a non-blocking (does not stop the remaining tasks
    // from executing while it waits)
    if(w && SC.typeOf(w) === SC.T_STRING)
      return this._createWait(); 

    { // BEGIN TARGET

      type = SC.typeOf(t);

      // need to narrow down and determine the target
      if(type === SC.T_STRING)
        t = SC.objectForPropertyPath(t);
      
      // if that didn't turn up an object
      if(SC.none(t)) t = this;


    } // END TARGET

    { // BEGIN METHOD

      type = SC.typeOf(m);

      // if method is not a string OR a function we need
      // to verify that it is just a status update
      if(type !== SC.T_STRING && type !== SC.T_FUNCTION)

        // if there is a status update we're ok so make a
        // fake function to return the boolean we're looking for
        if(!SC.none(s)) m = function() { return YES; };

        // significant error
        else this.error("No method supplied, nothing could be done!", YES);

    } // END METHOD
      
    { // BEGIN FAIL

      type = SC.typeOf(f);

      // if no fail state (string) or function were supplied
      // we just point it to the default of the XT.TaskState parent
      if(type === SC.T_STRING) f = this._getStateFunction(f);

    } // END FAIL

    { // BEGIN COMPLETE
  
      type = SC.typeOf(c);

      // it is the same case as for fail
      if(type === SC.T_STRING) c = this._getStateFunction(c);

      // but if it isn't a function we create one that will compare
      // the result to whatever complete was set to
      else if(type !== SC.T_FUNCTION)
        c = function(result) { return result === c; };

    } // END COMPLETE

    { // BEGIN CONTEXT
      
      type = SC.typeOf(x);

    } // END CONTEXT

  },

  /** @private */
  _createHold: function() {
    var h = this.get("hold"),
        f = this._holdingFunction,
        o = this.get("owner"), 
        c = SC.copy(o._continue), n;
    n = c.name = this._generateFunctionName();
    c.events = [h];
    o._registerEventHandler(n, c);
    this.fire = f;
    return f;
  },

  /** @private */
  _createWait: function() {
    var w = this.get("wait"),
        s = this,
        f = function() { return s.fire.call(s); },
        o = this.get("owner"), n;
    n = f.name = this._generateFunctionName();
    f.events = [w];
    o._registerEventHandler(n, f);
    this.set("wait", null);
    return f;
  },

  /** @private */
  _generateFunctionName: function() {
    var i = 0, len = 10, name = "";
    for(; i<len; ++i) { name += Math.floor(Math.random() * len); }
    return name;
  },

  //.................................................
  // Private Properties
  //

  /** @private */
  _complete: NO,

  /** @private */
  _holdingFunction: function() { return XT.HOLDING_TASK; },

}) ;
