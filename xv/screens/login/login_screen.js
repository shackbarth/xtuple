
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
    var form = XT.loginForm;
    form.$.username.setValue("admin");
    form.$.password.setValue("Assemble!Aurora");
    form.$.organization.setValue("aurora");
  }
});