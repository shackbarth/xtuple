
/**
  The initialization state for the table.
*/
XT.Initializing = XT.State.extend({

  //..............................................
  // Default Properties
  //

  /**
    Initialization routines on the table consist of a few asynchronous
    events that we will "check-off" this list. Once all elements have checked
    in then the statechart will allow the table to continue to its ready state.
  */
  checklist: [
    "CONTROLLER",
//     "DATAHANDLER",
    "TABLE",
  ],
  
  //..............................................
  // Substates
  //

  //..............................................
  // Actions
  //

  /**
    When the columns are done initializing they emit an event that is
    passed on to the controller and also passes it the columns array.
  */
  columnsInited: function(columns) {
    this.getPath("table.tableController").columnsSetup(columns);
  },

  /**
    Response to components of the table that are initializing themselves
    (the object) and the data (processing incoming data, etc.). Each element
    that checks-in gets removed from the checklist until they are all gone.
  */
  completed: function(who) {

    // grab the checklist
    var checklist = this.get("checklist");

    // try and find the entry
    var found = checklist.find(function(entry, idx, list) {

      // if the entry matches
      if(entry === who) {

        // remove it from the array
        list.removeAt(idx);

        // stop iteration on the find
        return YES;
      }
    });

    // if we didn't find it...
    if(!found)

      // we don't know who `who` is...
      console.warn("Unable to remove %@ from checklist during initialization");
  },

  /**
    When a fatal error is encountered by the table this allows it to fail cleanly
    even though the application probably can't continue without it...
  */
  _xt_fatal: function(msg) {

    // set the error message to the messages stack on the statechart
    this.statechart.get("msgs").unshift(msg);

    // go to the error state so the table will at least show the errors
    this.statechart.gotoState("ERROR", this);
  },

  //..............................................
  // Methods
  //

  /** @private */
  init: function() {

    // execute defaults
    arguments.callee.base.apply(this, arguments);

    this.set("checklist", this.get("checklist").slice());

    // add an observer on the checklist
    this.addObserver("checklist.length", this, "checkCompleted");
  },

  /** @private */
  destroy: function() {

    // delete the manually created observer
    this.removeObserver("checklist", this, "checkCompleted");

    // resume normal activities...
    arguments.callee.base.apply(this, arguments);
  },

  /** @private
    Automatically checks when checklist changes to see if it is empty.
    If it determines there are no more tasks to complete, it will allow
    the statechart to continue.
  */
  checkCompleted: function() {
    
    // grab the checklist
    var checklist = this.get("checklist");

    // if it is empty, go ahead and tell the statechart to move on
    if(checklist.length == 0) this.statechart.gotoState("READY", this);
  },

});

