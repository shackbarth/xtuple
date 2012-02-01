
sc_require("states/base");

/**
  Primary statechart for table view. Has many transient states and concurrent
  substates that either allow/disallow specific features post-initializiation.
*/
XT.TableStatechart = SC.Statechart.extend({

  //..............................................
  // Default Properties
  //

  /**
    For development only.
  */
  trace: NO,

  suppressStatechartWarnings: YES,

  /**
    Has to be a root state.
  */
  rootState: null,

  /** @private
    Used internally for reported warnings and errors.
  */
  msgs: null,

  //..............................................
  // Methods
  //

  /** @private */
  init: function() { 

    // initialize the messages stack
    this.set("msgs", []);

    // make sure to add the reference to the owner/table to
    // the rootState properties
    var props = SC.clone(XT.TableStatechart.rootStateProps);

    // set the table property
    props.table = this.get("owner");

    // now set the rootState...
    this.rootState = XT.State.extend(props);

    // carry on now
    arguments.callee.base.apply(this, arguments);
  },

});

XT.TableStatechart.rootStateProps = {

    /**
      First thing to do is initialize.
    */
    initialSubstate: "READY",
    // initialSubstate: "INITIALIZING",

    //..............................................
    // Substates
    //

    "READY":                SC.State.plugin("XT.Ready"),
    
    "ERROR":                SC.State.plugin("XT.Error"),

    //..............................................
    // Transient States
    //

    // "INITIALIZING":         SC.State.plugin("XT.Initializing"),

    //..............................................
    // Actions
    //

    //..............................................
    // Methods
    //

    /** @private */
    unknownEvent: function(e) {
      this.stateLogWarning("Unhandled event caught: %@".fmt(e));
    },

};

