
/*globals XT */

/** @class
  
  @todo There are many parts only partially implemented.

*/
XT.TaskState = SC.State.extend(
  /** @scope XT.TaskState.prototype */ {

  enterState: function() {
    return SC.Async.perform("start");
  },
  
  tasks: [],

  complete: function() {
    SC.Logger.warn("Default completion reached in XT.TaskState");
  },

  fail: function() {
    SC.Logger.error("There was an error when processing tasks");
  },

  /** @private
    The method to invoke once the state has
    been fully entered.
  */
  start: function() {
    this.resumeGotoState();
    var t = this.get("tasks"),
        c = this.get("complete"),
        f = this.get("fail");
    var self = this;
    var ts = this._tasks = t.slice().map(function(task) { return self._task(task); });
    c = this._complete = this._getStateFunction(c);
    f = this._fail = this._getStateFunction(f);
    for(var i=0; i<ts.length; ++i)
      if(!ts[i]())
        f();
    c();
  },
  
  /** @private */
  _getStateFunction: function(param) {
    if(SC.typeOf(param) === SC.T_STRING) {
      var orig = param, self = this;
      param = this.statechart.getState(orig);
      if(!SC.none(param)) { param = function() { self.gotoState(orig); }; }
      else SC.Logger.error("Non-state set as completion task but was a string");
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
    if(SC.none(t)) SC.Logger.error("Target of task is invalid");
    if(SC.typeOf(m) !== SC.T_STRING)
      SC.Logger.error("No target method supplied to task");
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

}) ;
