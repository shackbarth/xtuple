
enyo.kind({
  name: "XT.UserLoginScreen",
  kind: "Control",
  classes: "xt-user-login-screen",
  components: [
    { name: "block", kind: "XT.UserLoginBlock" },
    { name: "logo", kind: "XT.LoginLogoBlock" }
  ]
});

enyo.kind({
  name: "XT.LoginLogoBlock",
  kind: "Control",
  classes: "xt-login-logo-block"
});