
/*globals XT */

sc_require("mixins/logging");

/** @namespace

*/
SC.mixin((XT.SessionStatechart = {}), SC.StatechartManager,
  /** @scope XT.SessionStatechart.prototype */ { 

  initialState: "IDLE",
  trace: YES,

  IDLE: XT.State.extend({
    gotoLoggedOut: function() {
      this.gotoState("LOGGEDOUT");
    }.handleEvents("loggedOut")
  }),

  LOGGEDOUT: SC.State.extend(XT.Logging, {
    enterState: function() {
      XT.Router.clear().queue("login");
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
