
/*globals XT */

sc_require("ext/task");

/** @class

*/
XT.TaskState = XT.State.extend(
  /** @scope XT.TaskState.prototype */ {

  //..................................................
  // Public Methods
  //

  //..................................................
  // Public Properties
  //

  /** @property */
  isFinished: NO,

  /** @property */
  tasks: [],

  /** @property */
  complete: null,

  /** @property */
  fail: null,

  /** @property */
  holding: NO,

  /** @property */
  interrupt: NO,

  //..................................................
  // Private Properties
  //

  _tasks: null,

  //..................................................
  // Private Methods
  //

  /** @private */
  enterState: function() {
   return SC.Async.perform("start");
  },

  /** @private */
  start: function() {
    this.resumeGotoState();
    this.log("Starting...");
    if(this.get("isFinished") === YES || this.get("didFail") === YES)
      this.error("Cannot `start` a completed task state or `restart` a failed task state", YES); 
    this._setup(); 
    this._execTasks();
  },

  /** @private */
  continue: function() {
    var h = this.get("holding");
    if(!h || h === NO) return;
    if(this.get("interrupt")) {
      this.error("Cannot `continue` an interrupted task state, must be reset");
      return;
    }
    this.set("holding", NO);
    this._execTasks();
  },

  interrupted: function() {
    this.set("interrupt", YES);
  },

  /** @private */
  _execTasks: function() {
    var ts = this._tasks;
    while(ts.length > 0) {

      if(this.get("interrupt")) {
        this.warn("Was interrupted!");
        return;
      }
    
      var t = ts.shift();

      // console.warn("task target => ", t.get("target"));

      var r = t.fire();

      // console.warn("task fired and returned => ", r);

      // if we run into a holding task we have to block
      // until the event that wakes it up is fired
      if(r === XT.HOLDING_TASK || r === XT.REGISTERED_HOOK) {
        this.log("Holding task found, blocking until further events");
        this.set("holding", YES);
        return;
      }

      else if(r === XT.TASK_FAIL) {
        console.error("IT DID FAIL!");
        this.set("didFail", YES);
        return XT.TASK_FAIL;
      }
      // @todo Should this really run another fail since the task will
      //  will run it on fail anyways?
    }

    this.set("isFinished", YES);
    var c = this.get("complete");
    if(SC.typeOf(c) === SC.T_FUNCTION) c.call(this);
  },

  /** @private */
  reset: function() {
    if(this.get("isFinished"))
      this.set("isFinished", NO);
    this.set("interrupt",  NO);
    this.set("didFail", NO);
  },

  /** @private */
  _interrupted: function() {
    if(this.get("interrupt") && this.get("holding"))
      this.set("didFail", YES);
  }.observes("interrupt"),

  /** @private */
  _setup: function() {
    if(this.get("isFinished") === YES)
      this.error("Cannot `setup` a completed task state", YES); 
    this.log("Running initial setup");
    var t = this.get("tasks"),
        c = this.get("complete"),
        f = this.get("fail"),
        self = this, ts = [];
    this.complete = this._getStateFunction(c);
    this.fail = this._getStateFunction(f); 
    ts = this._tasks = t.slice().map(
      function(task) { return XT.Task.create(task, { owner: self }); }).compact();
    this.log("Setup completed, generated %@ task%@".fmt(
      ts.length, ts.length > 1 || ts.length == 0 ? "s" : ""));
  },

  /** @private */
  _getStateFunction: function(param) {
    if(SC.typeOf(param) === SC.T_FUNCTION) return param;
    if(SC.typeOf(param) !== SC.T_STRING)
      this.error("%@ is not a valid state to use for a complete/fail".fmt(param), YES);
    var orig = param, self = this;
    param = this.statechart.getState(orig);
    if(!SC.none(param)) { param = function() { self.gotoState(orig); }; }
    else this.error("Non-state set as complete/fail for task", YES);
    return param;
  },

}) ;
