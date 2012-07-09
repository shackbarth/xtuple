
enyo.kind({
  name: "XV.UserLoginScreen",
  kind: "Control",
  classes: "xt-user-login-screen",
  components: [
    { name: "block", kind: "XV.UserLoginBlock" },
    { name: "logo", kind: "XV.LoginLogoBlock" }
  ]
});

enyo.kind({
  name: "XV.LoginLogoBlock",
  kind: "Control",
  classes: "xt-login-logo-block"
});