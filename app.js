
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
    { name: "loginScreen", kind: "XT.LoginScreen" },
    { name: "dashboard", kind: "XT.Dashboard" }
  ],
  
  /** */
  published: {
    
    /** */
    isStarted: false
  },
  
  /** */
  carouselEvents: {
    
    /** */
    acquiredSession: "dashboard"
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
  },
  
  /** */
  completed: function() {
    var screen;
    
    this.inherited(arguments);

    // TODO: this really shouldn't be necessary, the point
    // is to keep the off-screen view (loginScreen) from reflowing
    // or listening on events - which it shouldn't be if it's not
    // visible?
    // TODO: second note is that `destroy` on loginScreen throws
    // an exception even after control has been removed
    if (this.getCurrentView() === "dashboard") {
      screen = this.$.loginScreen;
      this.removeControl(screen);
      screen.removeNodeFromDom();
      //screen.destroy();
    }

  }
    
});