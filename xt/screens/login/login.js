
enyo.kind(
  /** */ {

  /** */
  name: "XT.Login",
  
  /** */
  kind: "XT.ScreenCarousel",
  
  /** */
  components: [
    { name: "loginScreen", kind: "XT.LoginScreen" },
    { name: "dashboard", kind: "XT.Dashboard" }
  ],
  
  /** */
  carouselEvents: {
    
    /** */
    acquiredSession: "dashboard"
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
    if (this.getCurrentView() === "dashboard" && !this.removedLogin) {
      screen = this.$.loginScreen;
      this.removeControl(screen);
      screen.removeNodeFromDom();
      
      this.removedLogin = true;
      //screen.destroy();
    }

  }
    
});