
enyo.kind({
  name: "XV.Login",
  kind: "XV.ScreenCarousel",
  classes: "xt-login",
  components: [
    { name: "loginScreen", kind: "XV.LoginScreen" },
    { name: "dashboard", kind: "XV.Dashboard" }
  ],
  carouselEvents: {
    acquiredSession: "dashboard"
  }
  
});