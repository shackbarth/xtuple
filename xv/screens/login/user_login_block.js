
enyo.kind({
  name: "XT.UserLoginBlock",
  kind: "Control",
  classes: "xt-user-login-block enyo-unselectable",
  components: [
    { name: "subBlock", kind: "XT.UserLoginSubBlock" }
  ]
});

enyo.kind({
  name: "XT.UserLoginSubBlock",
  kind: "Control",
  classes: "xt-user-login-sub-block enyo-unselectable",
  components: [
    { name: "form", kind: "XT.UserLoginForm" }
  ]
});
  
enyo.kind({
  name: "XT.UserLoginForm",
  kind: "Control",
  classes: "xt-user-login-form enyo-unselectable",
  create: function() {
    this.inherited(arguments);
    XT.loginForm = this;
  },
  components: [
    { name: "username", kind: "XT.LoginInput", placeholder: "Username" },
    { name: "password", kind: "XT.LoginInputPassword", placeholder: "Password" },
    { name: "organization", kind: "XT.LoginInput", placeholder: "Organization" },
    { name: "login", kind: "XT.LoginButton", content: "Login" }
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
      } else { 
        console.warn("could not connect! ", response);
      }
    });
  }
});
  
enyo.kind({
  name: "XT.LoginInput",
  kind: "XT.Input",
  classes: "xt-login-input"
});

enyo.kind({
  name: "XT.LoginInputPassword",
  kind: "XT.LoginInput",
  type: "password"
});

enyo.kind({
  name: "XT.LoginButton",
  kind: "XT.Button",
  classes: "xt-login-button"
});
  
    //{ classes: "xt-user-login-form", components: [
    //  { kind: "XT.UserLoginBlockRow", components: [
    //    { kind: "onyx.InputDecorator", components: [
    //      { name: "username", kind: "onyx.Input", placeholder: "Username" } ]} ]},
    //  { kind: "XT.UserLoginBlockRow", components: [
    //    { kind: "onyx.InputDecorator", components: [
    //      { name: "password", kind: "onyx.Input", type: "password", placeholder: "Password" } ]} ]},
    //  { kind: "XT.UserLoginBlockRow", components: [
    //    { kind: "onyx.InputDecorator", components: [
    //      { name: "organization", kind: "onyx.Input", placeholder: "Organization" } ]} ]},
    //  { kind: "XT.UserLoginBlockButtonRow", components: [
    //    { name: "button", kind: "onyx.Button", content: "Login" } ]}
    //    ]}
  //]
//});

//enyo.kind({
//  name: "XT.UserLoginBlockRow",
//  classes: "user-login-block-row"
//});

//enyo.kind({
//  name: "XT.UserLoginBlockButtonRow",
//  kind: "XT.UserLoginBlockRow",
//  tap: function() {
//    var owner = this.owner.$;
//    var credentials = {
//      username: owner.username.getValue(),
//      password: owner.password.getValue(),
//      organization: owner.organization.getValue()
//    };
//    var self = this;
//    XT.session.acquireSession(credentials, function(response) {
//      //owner.username.clear();
//      //owner.password.clear();
//      //owner.organization.clear();
//      
//      if (response.code === 1) {
//        self.bubble("multipleSessions", {eventName:"multipleSessions"});
//      } else { self.bubble("sessionAcquired", {eventName:"sessionAcquired"}); }
//    });
//  } 
//});