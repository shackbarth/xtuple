
enyo.kind(
  /** */ {

  /** */
  name: "XT.SessionSelectionScreen",
  
  /** */
  kind: "FittableRows",
  
  /** */
  fit: true,
  
  /** */
  components: [
    { name: "toolbar", kind: "onyx.Toolbar", components: [
      { name: "label", content: "Please select from the following sessions" },
      { name: "button", kind: "onyx.Button", content: "New Session" } ]},
    { name: "sessions", kind: "XT.AvailableSessions" }
  ],
  
  /** */
  tap: function(inSender, inEvent) {
    var self = this;
    
    // if the originator is the new-session button
    if (inEvent.originator.name === "button") {
      XT.session.selectSession("FORCE_NEW_SESSION", function() {
        self.bubble("acquiredSession", {eventName:"acquiredSession"});
      });
    }
  },
  
  didBecomeActive: function() {
    this.$.sessions.rendered();
  }
    
});