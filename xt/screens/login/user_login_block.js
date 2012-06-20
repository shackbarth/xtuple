
enyo.kind({
  name: "XT.UserLoginBlock",
  kind: "Control",
  classes: "xt-user-login-block",
  components: [
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "username", kind: "onyx.Input", placeholder: "Username" } ]} ]},
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "password", kind: "onyx.Input", type: "password", placeholder: "Password" } ]} ]},
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "organization", kind: "onyx.Input", placeholder: "Organization" } ]} ]},
    { kind: "XT.UserLoginBlockButtonRow", components: [
      { name: "button", kind: "onyx.Button", content: "Login" } ]}
  ]
});

enyo.kind({
  name: "XT.UserLoginBlockRow",
  classes: "user-login-block-row"
});

enyo.kind({
  name: "XT.UserLoginBlockButtonRow",
  kind: "XT.UserLoginBlockRow",
  tap: function() {
    var owner = this.owner.$;
    var credentials = {
      username: owner.username.getValue(),
      password: owner.password.getValue(),
      organization: owner.organization.getValue()
    };
    var self = this;
    XT.session.acquireSession(credentials, function(response) {
      //owner.username.clear();
      //owner.password.clear();
      //owner.organization.clear();
      
      if (response.code === 1) {
        self.bubble("multipleSessions", {eventName:"multipleSessions"});
      } else { self.bubble("sessionAcquired", {eventName:"sessionAcquired"}); }
    });
  } 
});