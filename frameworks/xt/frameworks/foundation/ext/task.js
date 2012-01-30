
/*globals XT */

sc_require("ext/object");

/** @class

*/

XT.HOLDING_TASK = XT.hex();
XT.REGISTERED_HOOK = XT.hex();
XT.TASK_FAIL = XT.hex();

XT.Task = XT.Object.extend(
  /** @scope XT.Task.prototype */ {

  //.................................................
  // Properties
  //
  
  /** @property */
  args: null,

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
      if(!task.fire) this.error("No fire method on task", YES);
      var ret = task.fire();
      return ret;
    }
    this.error("Task object executed but no task method had been created", YES);
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
    var a = this.get("args"),
        m = this.get("method"),
        t = this.get("target"),
        f = this.get("fail"),
        c = this.get("complete"),
        w = this.get("wait"),
        h = this.get("hold"),
        s = this.get("status"),
        x = this.get("context"),
        o = this.get("owner"), 
        self = this, type, task;  


    console.log(
      "a = ", a,
      "m = ", m,
      "t = ", t,
      "f = ", f,
      "c = ", c,
      "w = ", w,
      "h = ", h,
      "s = ", s,
      "x = ", x,
      "o = ", o
    );

    
    // if this is a holding task, not much to it
    if(h && SC.typeOf(h) === SC.T_STRING) {
      this.log("Creating a holding task", h);
      return this._createHold(); 
    }

    // if this is a waiting task for an event, it is
    // a non-blocking (does not stop the remaining tasks
    // from executing while it waits)
    if(w && SC.typeOf(w) === SC.T_STRING) {
      // this.log("Creating a waiting task");
      return this._createWait(); 
    }

    { // BEGIN TARGET

      type = SC.typeOf(t);

      // need to narrow down and determine the target
      if(type === SC.T_STRING)
        t = SC.objectForPropertyPath(t);
      
      // if that didn't turn up an object
      if(SC.none(t)) t = this;

      // console.warn("TARGET => ", t);

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

      // console.warn("METHOD => ", m);

    } // END METHOD
      
    { // BEGIN FAIL

      type = SC.typeOf(f);

      // if no fail state (string) or function were supplied
      // we just point it to the default of the XT.TaskState parent
      if(type === SC.T_STRING) f = o._getStateFunction(f);

      // if it isn't a function try and point it at the owner's
      // fail method
      else if(type !== SC.T_FUNCTION) f = o.fail;

      // if by now it isn't a function, we're in trouble
      if(SC.typeOf(f) !== SC.T_FUNCTION)
        this.error("Could not find a valid fail-state method", YES);


      // console.warn("FAIL => ", f);

    } // END FAIL

    { // BEGIN COMPLETE
  
      type = SC.typeOf(c);

      // it is the same case as for fail
      if(type === SC.T_STRING) c = o._getStateFunction(c);

      // but if it isn't a function we create one that will compare
      // the result to whatever complete was set to
      else if(type !== SC.T_FUNCTION)
        c = function(result) { return result === YES; };


      // console.warn("COMPLETE => ", c);

    } // END COMPLETE

    { // BEGIN CONTEXT
      
      type = SC.typeOf(x);

      // if there is no context defined, use this unless it
      // is a string that can be resolved to an object
      if(type !== SC.T_OBJECT) {
        if(type === SC.T_STRING) {
          var path = x;
          x = SC.objectForPropertyPath(path);
          if(SC.typeOf(x) !== SC.T_OBJECT)
            this.error("Context object could not be found, %@".fmt(path), YES);
        } else { x = this; }
      }

      // console.warn("CONTEXT => ", x);

    } // END CONTEXT

    { // BEGIN TASK FUNCTION

      // here is the actual runtime function to be executed when
      // a task-state wishes to execute this task, this function
      // consists of running other methods on the task object
      // with the appropriate context and providing the appropriate
      // data to them
      task = function() {
        

        // console.warn("status => ", s, " target => ", t, " method => ", m, " arguments => ", a, 
        //   " context => ", x, " fail => ", f, " complete => ", c);


        // execute any status updates/changes that need to be made
        self._execStatusUpdate(s);

        // execute the method for the task on the appropriate target
        var result = self._execMethod(t, m, a)

        // console.warn("TASK SHOULD RETURN => ", result);

        // execute the completion function to verify success
        if(!self._execCompletionTest(x, c, result)) {
          this.warn("Failed to complete task");
          self._execFailureMethod(x, f, result);
          return XT.TASK_FAIL;
        }

        return !! result;
  
      };

      // console.warn("TASK FUNCTION => ", task);

      // go ahead and set the fire method to this new task method
      this.fire = task;

      // console.warn("IT WAS SET !!");

    } // END TASK FUNCTION

    return this;
  },

  /** @private */
  _createHold: function() {
    var h = this.get("hold"),
        k = !~h.indexOf("PLUGIN_DID_LOAD") ? NO : YES,
        f = k ? this._hookFunction : this._holdingFunction,
        o = this.get("owner"), 
        c = SC.copy(o.continue), n;
    n = c.name = this._generateFunctionName();
    c.events = [h];
    if(k) Plugin.Controller.registerHook(h, o.statechart);
    o._registerEventHandler(n, c);
    this.fire = f;
    this.set("hold", null);
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

  /** @private */
  _holdingFunction: function() {
    // this.fire = this._createTask();
    return XT.HOLDING_TASK;
  },

  /** @private */
  _hookFunction: function() {
    return XT.REGISTERED_HOOK;
  },

  /** @private */
  _execStatusUpdate: function(status) {
    if(SC.none(status)) return;
    var m = status.message,
        p = status.property,
        a = status.active,
        i = status.image, img;
    if(SC.typeOf(i) === SC.T_STRING && SC.none(a))
      a = YES;
    if(SC.typeOf(m) === SC.T_STRING)
      if(!p) this.error("No property for message controller", YES);
      else XT.MessageController.set(p, m); 
    img = XT.StatusImageController.getImage(i);
    if(img) img.set("isActive", a);
  },

  /** @private */
  _execMethod: function(target, method, args) {
    if(args) args = SC.typeOf(args) === SC.T_ARRAY ? args : [args]; 

    console.warn("TARGET DETERMINED TO BE => ", target);
    console.warn("METHOD DETERMINED TO BE => ", method);
    console.warn("ARGUMENTS DETERMINED TO BE => ", args);

    if(!target[method]) return method.apply(target, args);
    else return target[method].apply(target, args);
  },

  /** @private */
  _execCompletionTest: function(context, test, result) {
    var r = test.call(context, result);
    // console.warn(test, r, result);
    return r;
  },

  /** @private */
  _execFailureMethod: function(context, fail, result) {
    console.error("HGUILWEBFUILWEBRILUEBRW");
    return fail.call(context, result);
  },

  //.................................................
  // Private Properties
  //

  /** @private */
  _complete: NO,

}) ;
