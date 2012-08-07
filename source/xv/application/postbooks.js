
enyo.kind({
  name: "XV.Postbooks",
  kind: "Control",
  classes: "xt-postbooks enyo-unselectable",
  components: [
    { name: "container", kind: "XV.PostbooksContainer" }
  ],
  getContainer: function () {
    return this.$.container;
  },
  getActiveModule: function () {
    return this.getContainer().getActive();
  }
});

enyo.kind({
  name: "XV.PostbooksContainer",
  kind: "XV.ScreenCarousel",
  classes: "xt-postbooks-container enyo-unselectable",
  components: [
    { name: "dashboard", kind: "XV.Dashboard" },
    { name: "crm", kind: "XV.Crm" },
    { name: "billing", kind: "XV.Billing" },
    { name: "setup", kind: "XV.Setup" },
    { name: "workspace", kind: "XV.WorkspaceContainer" }
  ],
  carouselEvents: {
    crm: "crm",
    billing: "billing",
    setup: "setup",
    workspace: "workspace",
    dashboard: "dashboard"
  },
  getModuleByName: function (name) {
    return this.$[name];
  },
  applyWorkspace: function (model) {
    this.setCurrentView("workspace");
    this.$.workspace.setOptions(model);
  }
});
