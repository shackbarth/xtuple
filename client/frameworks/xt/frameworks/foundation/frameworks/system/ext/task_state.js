
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
    if(this.get("isFinished") === YES)
      this.error("Cannot `start` a completed task state", YES); 
    this._setup(); 
    this._execTasks();
  },

  /** @private */
  continue: function() {
    var h = this.get("holding");
    if(!h || h === NO) return;
    this.set("holding", NO);
    this._execTasks();
  },

  /** @private */
  _execTasks: function() {
    var ts = this._tasks;
    while(ts.length > 0) {
      var t = ts.shift();

      console.warn("task target => ", t.get("target"));

      var r = t.fire();

      // if we run into a holding task we have to block
      // until the event that wakes it up is fired
      if(r === XT.HOLDING_TASK) {
        this.log("Holding task found, blocking until further events");
        this.set("holding", YES);
        return;
      }

      // @todo Should this really run another fail since the task will
      //  will run it on fail anyways?
    }

    this.set("isFinished", YES);
    var c = this.get("complete");
    if(SC.typeOf(c) === SC.T_FUNCTION) c();
  },

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
