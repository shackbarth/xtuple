
/*globals XT */

sc_require("ext/state");

/** @class
  
  @todo There are many parts only partially implemented and several
    key features missing for other useful use-cases.

  The TaskState is designed to allow a sequence of tasks to be
  executed on entering a state automatically with conventional
  error handling. Typically this would not be possible to fire
  off a sequence of events that need for the state and the
  statechart to complete their initializations during the
  enterState method of a state. The TaskState allows you
  to do this correctly and fairly extensibly. 

  You provide an array of tasks to be completed. A task can
  have certain properties:

  `fail`        -       Can be a function or a string. If a string it will be
                        interpreted as another state to go to if the task fails.
                        If it is a function, the function will be called with the
                        explicitly/implicitly derrived context.

  `complete`    -       Can be a function, a string or a boolean. If a string it will be
                        interpreted as another state to go to if the task completes
                        successfully (null or true value returned by task). If it is
                        a function it will be executed via the same rules as fail. If
                        it is a boolean the result of the task will be compared against
                        it to determine success.

  `target`      -       Can be an object or a string. If it is an object then the task
                        method will be looked for on this object. If it is a string the
                        task constructor will attempt to find it by its path provided.

  `method`      -       Can be a string or a function. If it is a string it is assumed to be
                        the name of the method to call on `target` (explicitly or implicitly defined).

  `context`     -       Can be a string or an object. Same as `target` but used as the context from
                        which to execute complete and failure methods.

  `arguments`   -       Can be anything. If it is a function, the the return value of the function
                        will be used as the arguments for the `method`. If it is anything that
                        is not an array, it will be placed in one and applied to the `method`.

*/
XT.TaskState = XT.State.extend(
  /** @scope XT.TaskState.prototype */ {

  enterState: function() {
    return SC.Async.perform("start");
  },
  
  tasks: [],

  complete: function() {
    this.warn("Default completion reached");
  },

  fail: function() {
    this.warn("There was an error when processing tasks");
  },

  /** @private
    The method to invoke once the state has
    been fully entered.
  */
  start: function() {
    this.resumeGotoState();
    if(this._finished === YES) {
      this.warn("Attempt to re-run completed tasks routine");
      return;
    }
    var ts = this._setup();
    this.log("Executing tasks");
    for(var i=0; i<ts.length; ++i) {
      if(this._exec_task(ts[i]) === NO)
        return this._fail();
    }
    this.log("All non-sleeper tasks completed successfully or errors were handled");
    if(this._sleepers <= 0) {
      // @todo This needs to be reassessed. Find a way to handle events fired
      //  during the execution AFTER this test because the completion function
      //  will otherwise be called twice (except for this hack)
      if(this._finished === NO) {
        this._complete();
        this._finished = YES;
      }
    } else { this.log("Waiting for sleeper tasks to complete"); }
  },

  /** @private */
  _exec_task: function(task) {
    if(SC.none(task)) return NO;
    if(task.didWait && task.didWait === YES)
      task = task();
    return task();
  },
  
  /** @private */
  _setup: function() {
    if(this._finished === YES) {
      this.warn("Attempt to re-run completed tasks routine");
      return;
    }
    this.log("Running initial setup");
    var t = this.get("tasks"),
        c = this.get("complete"),
        f = this.get("fail");
    var self = this;
    var ts = this._tasks = t.slice().map(function(task) { return self._task(task); }).compact();
    this._complete = this._getStateFunction(c);
    this._fail = this._getStateFunction(f);
    this.log("Setup complete, generated %@ task%@ and %@ sleeper%@".fmt(
      ts.length, ts.length === 1 ? "" : "s",
      self._sleepers, self._sleepers === 1 ? "" : "s"));
    return ts;
  },

  /** @private */
  _getStateFunction: function(param) {
    if(SC.typeOf(param) === SC.T_STRING) {
      var orig = param, self = this;
      param = this.statechart.getState(orig);
      if(!SC.none(param)) { param = function() { self.gotoState(orig); }; }
      else this.error("Non-state set as completion task but was a string");
    }
    return param;
  },

  /** @private
    @todo: This is not a full implementation yet.
  */
  _task: function(hash) {
    var m = hash.method,
        t = hash.target,
        c = hash.complete,
        f = hash.fail,
        x = hash.context,
        a = hash.arguments,
        w = hash.wait,
        h = hash.status,
        s = this;
    if(w) {
      if(w === YES) {
        delete hash.wait;
        var task = function() {
          return s._task.call(s, hash); 
        };
        task.didWait = YES;
        return task;
      }
      else if(SC.typeOf(w) === SC.T_STRING) {
        var event = w, callback;
        if(SC.none(event)) 
          this.error("Must provide an event", YES);
        delete hash.wait;
        callback = function() {
          console.warn("IN THE CALLBACK!");
          task = s._task.call(s,hash);
          if(s._exec_task(task) === NO)
            s._fail();
          if(s._sleepers > 0) s._sleepers -= 1;
          s.tryToHandleEvent("sleeperExecuted");
        };
        callback.events = SC.typeOf(event) === SC.T_ARRAY ? event : [event];
        var name = callback.name = this.generateName();
        this.warn(callback);
        this._registerEventHandler(name, callback);
        this._sleepers += 1;
        return null;
      }
    }
    if(SC.typeOf(t) === SC.T_STRING)
      t = SC.objectForPropertyPath(t);
    if(SC.none(t)) t = s;
    if(SC.typeOf(m) !== SC.T_STRING && SC.typeOf(m) !== SC.T_FUNCTION)
      this.error("No target method supplied to task", YES);
    if(SC.typeOf(f) === SC.T_STRING)
      f = this._getStateFunction(f);
    if(SC.typeOf(c) === SC.T_STRING)
      c = this._getStateFunction(c);
    else if(SC.typeOf(c) !== SC.T_FUNCTION)
      c = function(result) { return result === c; };
    if(SC.typeOf(x) !== SC.T_OBJECT)
      x = this;
    return function() {
      var result, target;
      if(!SC.none(h)) {
        var msg = h.message,
            prop = h.property,
            active = h.active,
            image = h.image;
        if(!SC.none(image) && SC.none(active))
          active = YES;
        XT.MessageController.set(prop, msg);
        image = XT.StatusImageController.getImage(image);
        console.warn("FOUND => ", image);
        if(!SC.none(image)) image.set("isActive", active);
        else s.warn("Could not find image %@ to activate".fmt(h.image));
      }
      if(SC.typeOf(t) === SC.T_FUNCTION) target = t();
      else target = t;
      if(!SC.none(a)) {
        if(SC.typeOf(a) === SC.T_FUNCTION) { a = a(); }
        else if(SC.typeOf(a) !== SC.T_ARRAY) { a = [a]; }
        if(SC.typeOf(m) === SC.T_FUNCTION)
          result = m.apply(target, a);
        else result = target[m].apply(target, a);
      } 
      else {
        if(SC.typeOf(m) === SC.T_FUNCTION)
          result = m.call(target);
        else result = target[m]();
      }
      if(!c.call(x, result))
        if(SC.typeOf(f) === SC.T_FUNCTION)
          f();
      return !! result;
    };
  },

  /** @private */
  sleeperExecuted: function() {
    if(this._sleepers <= 0) {
      this.log("All sleepers have completed, all tasks complete");
      this._complete();
      this._finished = YES;
    }
  },

  /** @private */
  _finished: NO,

  /** @private */
  _sleepers: 0,

  /** @private */
  generateName: function() {
    var i = 0, len = 10, name = "";
    for(; i<len; ++i) { name += Math.floor(Math.random() * len); }
    return name;
  }

}) ;
