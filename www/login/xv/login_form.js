
enyo.kind({
  name: "XV.LoginForm",
  classes: "xv-login-form onyx",
  create: function () {
    var c = enyo.getCookie("xtsessioncookie");
    this.inherited(arguments);
    if (!c) return;
    c = JSON.parse(c);
    this.$.id.setValue(c.id); 
  },
  send: function () {
    var credentials = this.getCredentials(), x;
    x = new enyo.Ajax({
      url: "authenticate",
      method: "POST"
    });
    x.go(JSON.stringify(credentials));
    x.response(this, "didReceiveResponse");
  },
  getCredentials: function () {
    return {
      id: this.$.id.getValue(),
      password: this.$.password.getValue()
    };
  },
  didReceiveResponse: function (ignore, response) {
    if (response.isError) {
      this.$.messageBox.addRemoveClass("error", true);
      this.$.messageBox.setContent(response.reason);
      return;
    }
    this.$.messageBox.addRemoveClass("error", false);
    this.$.messageBox.setContent("success!");
    //console.log(this);
    //console.log(response);
    //this.owner.setCookie(response);
    app.setCookie(response);
    //console.log(document.cookie);
    //this.owner.setSession(response);
    app.setSession(response);
    //this.owner.$.selection.setOrganizations(response.organizations);
    app.$.organizations.setOrganizations(response.organizations);
    //this.parent.setIndex(1);
    app.setCurrentView("organizationWrapper");
  },
  components: [
    {name: "box", kind: "onyx.Groupbox", components: [
      {name: "header", kind: "onyx.GroupboxHeader", content: "_pleaseLogin".loc()},
      {kind: "onyx.InputDecorator", components: [
        {name: "id", kind: "onyx.Input", placeholder: "_id".loc()}]},
      {kind: "onyx.InputDecorator", components: [
        {name: "password", kind: "onyx.Input", type: "password", placeholder: "_password".loc()}]},
      {kind: "onyx.Button", content: "Login", ontap: "send"}]},
      {name: "messageBox", classes: "xv-message-box"}
  ]
});