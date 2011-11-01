
/*globals XT */

sc_require("mixins/logging");

/** @namespace

*/
SC.mixin((XT.SessionStatechart = {}), SC.StatechartManager,
  /** @scope XT.SessionStatechart.prototype */ { 

  initialState: "IDLE",
  trace: YES,

  IDLE: SC.State.extend(XT.Logging, {
  }),

  LOGGEDOUT: SC.State.extend(XT.Logging, {
    enterState: function() {
      console.log(this);
    }
  }),

  LOGGEDIN: SC.State.extend(XT.Logging, {
    enterState: function() {
      this.owner.set("isActive", YES);
    }
  }),

  LOGGINGIN: SC.State.extend(XT.Logging, {

  }),

  LOGGINGOUT: SC.State.extend(XT.Logging, {
    
  })

}) ;
