
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
  initialState: "INITIALIZE",
    
  INITIALIZE: XT.State.plugin("PLUGIN.INITIALIZE"),
  READY: XT.State.plugin("PLUGIN.READY"),
  
  next: function() {
    
    // @todo Temporarily hardcoded to this.INITIALIZE
    this.statechart.gotoState("READY", this.INITIALIZE);
  }.handleEvents("ready")
    
}) ;
