
enyo.kind({
  name: "XT.SessionSelectionItem",
  kind: "FittableColumns",
  fit: true,
  classes: "session-selection-item-container",
  components: [
    { name: "username", classes: "session-selection-item" },
    { name: "organization", classes: "session-selection-item" },
    { name: "created", classes: "session-selection-item" }
  ]
});

enyo.kind({
  name: "XT.LoginSelectionList",
  kind: "FittableRows",
  fit: true,
  published: {
    activeSessions: []
  },
  activeSessionsChanged: function() {
    var sessions = this.getActiveSessions();
    this.$.list.setCount(sessions.length);
    this.$.list.reset();
  },
  components: [
    {
      name: "list",
      kind: "List",
      onSetupItem: "setupSessionItem",
      multiSelect: false,
      fit: true,
      components: [
        { name: "item", kind: "XT.SessionSelectionItem" }
      ]
    }
  ],
  setupSessionItem: function(inSender, inEvent) {
    var sessions = this.getActiveSessions();
    var idx = inEvent.index;
    var session = sessions[idx].sessionData;
    var item = this.$.item;
    item.$.username.setContent(session.username);
    item.$.organization.setContent(session.organization);
    item.$.created.setContent(session.created);
  }
});


/**
*/
enyo.kind(
  /** @scope XT.LoginScreen.prototype */ {

  name: "XT.LoginScreenChoices",
  kind: "FittableRows",
  classes: "onyx",
  fit: true,
  components: [
    { kind: "onyx.Toolbar", content: "Please select from the following active sessions..." },
    { kind: "XT.LoginSelectionList" }
  ] 
});