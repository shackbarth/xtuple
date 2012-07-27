
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
    { name: "dashboard", kind: "XV.Dashboard" },
    { name: "crm", kind: "XV.Crm" },
    { name: "billing", kind: "XV.Billing" },
    { name: "workspace", kind: "XV.Workspace" },
  ],
  carouselEvents: {
    crm: "crm",
    billing: "billing",
    workspace: "workspace"
  }
});
