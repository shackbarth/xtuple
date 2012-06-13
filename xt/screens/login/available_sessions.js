
enyo.kind(
  /** */ {

  /** */
  name: "XT.AvailableSessions",
  
  /** */
  kind: "FittableRows",
  
  /** */
  fit: true,
  
  /** */
  components: [
    { name: "list", kind: "List", fit: true, multiSelect: false, onSetupItem: "setupSession", components: [
      { name: "item", kind: "XT.SessionSelectionRow" } ]}
  ],
  
  /** */
  rendered: function() {
    var sessions;
    
    this.inherited(arguments);
    
    console.log(this);
    
    if (this.hasNode() && XT.session && this.getShowing()) {
      sessions = XT.session.getAvailableSessions() || [];
      this.$.list.setCount(sessions.length);
      this.$.list.reset();
    }
  },
  
  /** */
  setupSession: function(inSender, inEvent) {
    var row = this.$.item;
    var idx = inEvent.index;
    var data = XT.session.getAvailableSessions()[idx].sessionData;
    
    this.log(this, data, inEvent);
    
    row.$.username.setContent(data.username);
    row.$.organization.setContent(data.organization);
    row.$.created.setContent(data.created);
    row.$.sid.setContent(data.sid);
  }
    
});

enyo.kind(
  /** */ {

  /** */
  name: "XT.SessionSelectionRow",
  
  /** */
  classes: "session-selection-row",
  
  /** */
  components: [
    { name: "username" },
    { name: "organization" },
    { name: "created" },
    { name: "sid" }
  ]
    
});