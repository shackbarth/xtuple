
enyo.kind(
  /** */ {
    
  /** */
  name: "XT.LoginScreen",
  
  /** */
  kind: "XT.ScreenCarousel",
  
  /** */
  classes: "login-screen",
  
  /** */
  arrangerKind: "CardSlideInArranger",
  
  /** */
  carouselEvents: {
    
    /** */
    multipleSessions: "sessionSelection"
  },
  
  /** */
  components: [
    { name: "userLogin", kind: "XT.UserLoginScreen" },
    { name: "sessionSelection", /*kind: "XT.SessionSelectionScreen"*/ content: "sessionSelection" }
  ]
    
});