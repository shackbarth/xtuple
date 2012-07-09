
enyo.kind({
  name: "XV.AvailableSessions",
  kind: "Control",
  classes: "xt-available-sessions",
  components: [
    { name: "wrapper", classes: "xt-available-sessions-wrapper", components: [
      { name: "list", kind: "List", classes: "xt-available-sessions-list", multiSelect: false, onSetupItem: "setupRow", components: [
        { name: "item", kind: "XV.SessionSelectionRow" } ] } ] }
  ],
  
  //components: [
  //  { name: "list", kind: "List", multiSelect: false, onSetupItem: "setupRow", components: [
  //    { name: "item", kind: "XV.SessionSelectionRow" } ]}
  //],
  rendered: function() {
    var sessions;
    
    this.inherited(arguments);
    
    if (this.hasNode() && XT.session && this.getShowing()) {
      sessions = XT.session.getAvailableSessions() || [];
      this.$.list.setCount(sessions.length);
      this.$.list.reset();
    }
  },
  setupRow: function(inSender, inEvent) {
    var row = this.$.item;
    var idx = inEvent.index;
    var data = XT.session.getAvailableSessions()[idx].sessionData;
    
    var ts = XT.toReadableTimestamp(data.created);
    row.$.username.setContent(data.username);
    row.$.organization.setContent(data.organization);
    row.$.created.setContent(ts);
    row.$.sid.setContent(data.sid);
  }
    
});

enyo.kind({
  name: "XV.SessionSelectionRow",
  kind: "Control",
  classes: "xt-session-selection-row",
  components: [
    { name: "username", classes: "xt-session-row-element" },
    { name: "organization", classes: "xt-session-row-element" },
    { name: "created", classes: "xt-session-row-element" },
    { name: "sid", classes: "xt-session-row-element" }
  ]
    
});