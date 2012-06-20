
enyo.kind({
  name: "XT.Postbooks",
  kind: "Control",
  classes: "xt-postbooks enyo-unselectable onyx",
  components: [
    { name: "container", kind: "XT.PostbooksContainer" }
  ] 
});

enyo.kind({
  name: "XT.PostbooksContainer",
  kind: "XT.ScreenCarousel",  
  classes: "xt-postbooks-container enyo-unselectable",
  components: [
    { name: "login", kind: "XT.Login" },
    { name: "crm", kind: "XT.Crm" },
    { name: "billing", kind: "XT.Billing" }
  ],
  carouselEvents: {
    dashboard: "login",
    crm: "crm",
    billing: "billing"
  }
});