
enyo.kind({
  name: "XV.UserLoginBlock",
  kind: "Control",
  classes: "xt-user-login-block enyo-unselectable",
  components: [
    { name: "subBlock", kind: "XV.UserLoginSubBlock" }
  ]
});

enyo.kind({
  name: "XV.UserLoginSubBlock",
  kind: "Control",
  classes: "xt-user-login-sub-block enyo-unselectable",
  components: [
    { name: "form", kind: "XV.UserLoginForm" }
  ]
});
  
enyo.kind({
  name: "XV.UserLoginForm",
  kind: "Control",
  classes: "xt-user-login-form enyo-unselectable",
  create: function() {
    this.inherited(arguments);
    XV.loginForm = this;
  },
  components: [
    { name: "username", kind: "XV.LoginInput", placeholder: "Username" },
    { name: "password", kind: "XV.LoginInputPassword", placeholder: "Password" },
    { name: "organization", kind: "XV.LoginInput", placeholder: "Organization" },
    { name: "login", kind: "XV.LoginButton", content: "Login" }
  ],
  handlers: {
    onButtonTapped: "buttonTapped"
  },
  buttonTapped: function() {
    var owner = this.$;
    var credentials = {
      username: owner.username.getValue(),
      password: owner.password.getValue(),
      organization: owner.organization.getValue()
    };
    var self = this;
    XT.session.acquireSession(credentials, function(response) {
      if (response.code === 1) {
        self.bubble("multipleSessions", {eventName:"multipleSessions"});
      } else if (response.code === 4) { 
        self.bubble("sessionAcquired", {eventName:"sessionAcquired"}); 
      } else { /* error? */ }
    });
  }
});
  
enyo.kind({
  name: "XV.LoginInput",
  kind: "XV.Input",
  classes: "xt-login-input"
});

enyo.kind({
  name: "XV.LoginInputPassword",
  kind: "XV.LoginInput",
  type: "password"
});

enyo.kind({
  name: "XV.LoginButton",
  kind: "XV.Button",
  classes: "xt-login-button"
});
  