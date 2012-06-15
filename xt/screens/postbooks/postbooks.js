
enyo.kind(
  /** */ {

  name: "XT.Postbooks",
  kind: "FittableRows",
  fit: true,
  components: [
    { name: "container", kind: "XT.PostbooksContainer" }
  ],
  style: "position: absolute; height: 100%; width: 100%;"
    
});

enyo.kind(
  /** */ {
    
  /** */
  name: "XT.PostbooksContainer",
  
  /** */
  kind: "XT.ScreenCarousel",
  
  /** */  
  classes: "enyo-unselectable",
  
  fit: true,
  
  /** */
  components: [
    { name: "login", kind: "XT.Login" },
    { name: "crm", kind: "XT.Crm" },
    { name: "billing", kind: "XT.Billing" }
  ],
  
  /** */
  carouselEvents: {
    
    /** */
    dashboard: "login",
    
    /** */
    crm: "crm",
    
    /** */
    billing: "billing"
  }
    
});