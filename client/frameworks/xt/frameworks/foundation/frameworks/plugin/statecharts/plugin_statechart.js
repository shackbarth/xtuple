
/*globals XT */

sc_require("ext/plugin");
sc_require("states/initialize");
sc_require("states/ready");

/** @namespace

*/

XT.Plugin.reopen(
  /** @scope XT.Plugin.prototype */ {
    
  trace: YES,
  autoInitStatechart: YES,
  rootState: SC.State.extend({
    initialSubstate: "INITIALIZE",
    
    /** */
    INITIALIZE: SC.State.plugin("PLUGIN.INITIALIZE"),
    READY: SC.State.plugin("PLUGIN.READY"),
    
    next: function() {
      
      // @todo Temporarily hardcoded to this.INITIALIZE
      this.statechart.gotoState("READY", this.INITIALIZE);
    }.handleEvents("ready")
    
  })

}) ;
