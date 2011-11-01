
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
      if(!ts[i]())
        return this._fail();
    }
    this.log("All tasks completed successfully or errors were handled");
    this._complete();
    this._finished = YES;
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
    var ts = this._tasks = t.slice().map(function(task) { return self._task(task); });
    this._complete = this._getStateFunction(c);
    this._fail = this._getStateFunction(f);
    this.log("Setup complete, generated %@ task%@".fmt(
      ts.length, ts.length === 1 ? "" : "s"));
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
        s = this;
    if(SC.typeOf(t) === SC.T_STRING)
      t = SC.objectForPropertyPath(t);
    if(SC.none(t)) this.error("Target of task is invalid");
    if(SC.typeOf(m) !== SC.T_STRING)
      this.error("No target method supplied to task");
    if(SC.typeOf(f) === SC.T_STRING)
      f = this._getStateFunction(f);
    if(SC.typeOf(c) === SC.T_STRING)
      c = this._getStateFunction(c);
    else if(SC.typeOf(c) !== SC.T_FUNCTION)
      c = function(result) { return result === c; };
    if(SC.typeOf(x) !== SC.T_OBJECT)
      x = this;
    return function() {
      var result;
      if(!SC.none(a)) {
        if(SC.typeOf(a) === SC.T_FUNCTION) { a = a(); }
        else if(SC.typeOf(a) !== SC.T_ARRAY) { a = [a]; }
        result = t[m].apply(t, a);
      } else { result = t[m](); }
      if(!c.call(x, result))
        if(SC.typeOf(f) === SC.T_FUNCTION)
          f();
      return !! result;
    };
  },

  /** @private */
  _finished: NO,

}) ;
