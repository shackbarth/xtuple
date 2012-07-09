
enyo.kind({
  name: "XT.Login",
  kind: "XT.ScreenCarousel",
  classes: "xt-login",
  components: [
    { name: "loginScreen", kind: "XT.LoginScreen" },
    { name: "dashboard", kind: "Dashboard" }
  ],
  carouselEvents: {
    acquiredSession: "dashboard"
  }
  
});