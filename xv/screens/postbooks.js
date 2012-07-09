
enyo.kind({
  name: "XT.Postbooks",
  kind: "Control",
  classes: "xt-postbooks enyo-unselectable",
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
    { name: "crm", kind: "Crm" },
    { name: "billing", kind: "Billing" }
  ],
  carouselEvents: {
    dashboard: "login",
    crm: "crm",
    billing: "billing"
  }
});