
enyo.kind({
  name: "XV.Postbooks",
  kind: "Control",
  classes: "xt-postbooks enyo-unselectable",
  components: [
    { name: "container", kind: "XV.PostbooksContainer" }
  ]
});

enyo.kind({
  name: "XV.PostbooksContainer",
  kind: "XV.ScreenCarousel",
  classes: "xt-postbooks-container enyo-unselectable",
  components: [
    { name: "login", kind: "XV.Login" },
    { name: "crm", kind: "XV.Crm" },
    { name: "billing", kind: "XV.Billing" },
    { name: "workspace", kind: "XV.Workspace" },
  ],
  carouselEvents: {
    dashboard: "login",
    crm: "crm",
    billing: "billing",
    workspace: "workspace"
  }
});
