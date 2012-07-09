
enyo.kind({
  name: "XT.SessionSelectionScreen",
  kind: "Control",
  classes: "xt-session-selection-screen",
  components: [
    { name: "toolbar", kind: "onyx.Toolbar", components: [
      { name: "label", content: "Please select from the following sessions" },
      { name: "button", kind: "onyx.Button", content: "New Session" } ]},
    { name: "sessions", kind: "XT.AvailableSessions" }
  ],
  tap: function(inSender, inEvent) {
    var self = this;
    var origin = inEvent.originator;
    var idx = inEvent.index;
    var owner = origin.owner;
    
    // if the originator is the new-session button
    if (origin.name === "button") {
      XT.session.selectSession("FORCE_NEW_SESSION", function() {
        self.bubble("acquiredSession", {eventName:"acquiredSession"});
      });
    } else {
      
      // we check to see if this was a row and if so handle
      // that instead
      if (owner.name === "item" || idx) {
        XT.session.selectSession(idx, function(payload) {
          if (payload.isError) {
            console.warn("could not retrieve the selected session");
          } else {
            self.bubble("acquiredSession", {eventName:"acquiredSession"});
          }
        });
      }
    }
  },
  didBecomeActive: function() {
    this.$.sessions.rendered();
  }
});