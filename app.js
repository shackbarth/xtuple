
/**
*/
enyo.kind(
  /** */ {

  /** */
  name: "App",
  
  /** */
  kind: "XT.ScreenCarousel",
  
  /** */
  components: [
    { name: "login", kind: "XT.Login" },
    { name: "crm", kind: "XT.Crm" },
    { name: "billing", kind: "XT.Billing" }
  ],
  
  /** */
  published: {
    
    /** */
    isStarted: false
  },
  
  /** */
  carouselEvents: {
    
    /** */
    dashboard: "login",
    
    /** */
    crm: "crm",
    
    /** */
    billing: "billing"
  },
  
  start: function() {
    
    if (this.getIsStarted()) {
      
      // nothing to re-start
      return;
    }
    
    // on application start, create a datasource we can use
    XT.dataSource = new XT.DataSource();
    
    // now that we've started, we need to render something
    // to the screen
    // TODO: is this really where this belongs?
    this.renderInto(document.body);
    
    // lets not allow this to happen again
    this.setIsStarted(true);
  }
    
});