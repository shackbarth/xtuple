
enyo.kind({
  name: "XT.LoginScreen",
  kind: "XT.ScreenCarousel",
  classes: "xt-login-screen",
  carouselEvents: {
    multipleSessions: "sessionSelection"
  },
  components: [
    { name: "userLogin", kind: "XT.UserLoginScreen" },
    { name: "sessionSelection", kind: "XT.SessionSelectionScreen" }
  ],
  create: function() {
    this.inherited(arguments);
    
    // temporary
    this.$.userLogin.$.block.$.username.setValue("admin");
    this.$.userLogin.$.block.$.password.setValue("Assemble!Aurora");
    this.$.userLogin.$.block.$.organization.setValue("aurora");
    //this.$.userLogin.$.block.$.password.setValue("admin");
    //this.$.userLogin.$.block.$.organization.setValue("40beta");
  }
});