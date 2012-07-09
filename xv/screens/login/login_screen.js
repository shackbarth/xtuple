
enyo.kind({
  name: "XV.LoginScreen",
  kind: "XV.ScreenCarousel",
  classes: "xt-login-screen",
  carouselEvents: {
    multipleSessions: "sessionSelection"
  },
  components: [
    { name: "userLogin", kind: "XV.UserLoginScreen" },
    { name: "sessionSelection", kind: "XV.SessionSelectionScreen" }
  ],
  create: function() {
    this.inherited(arguments);
    
    // temporary
    var form = XV.loginForm;
    form.$.username.setValue("admin");
    form.$.password.setValue("Assemble!Aurora");
    form.$.organization.setValue("aurora");
  }
});