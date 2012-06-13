
enyo.kind(
  /** */ {

  /** */
  name: "XT.AvailableSessions",
  
  /** */
  classes: "available-sessions-container",
  
  /** */
  kind: "FittableRows",
  
  /** */
  fit: true,
  
  /** */
  components: [
    { name: "header", kind: "FittableColumns", classes: "session-selection-row header", components: [
      { content: "Username", classes: "session-row-username header" },
      { content: "Organization", classes: "session-row-organization header" },
      { content: "Created", classes: "session-row-created header" },
      { content: "Session ID", classes: "session-row-sid header" } ]},
    { name: "list", kind: "List", fit: true, multiSelect: false, onSetupItem: "setupRow", components: [
      { name: "item", kind: "XT.SessionSelectionRow" } ]}
  ],
  
  /** */
  rendered: function() {
    var sessions;
    
    this.inherited(arguments);
    
    if (this.hasNode() && XT.session && this.getShowing()) {
      sessions = XT.session.getAvailableSessions() || [];
      this.$.list.setCount(sessions.length);
      this.$.list.reset();
    }
  },
  
  /** */
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

enyo.kind(
  /** */ {

  /** */
  name: "XT.SessionSelectionRow",
  
  /** */
  kind: "FittableColumns",
  
  /** */
  classes: "session-selection-row table-row",
  
  /** */
  components: [
    { name: "username", classes: "session-row-username" },
    { name: "organization", classes: "session-row-organization" },
    { name: "created", classes: "session-row-created" },
    { name: "sid", classes: "session-row-sid" }
  ]
    
});