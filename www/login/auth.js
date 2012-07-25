
enyo.kind({
  name: "App",
  classes: "onyx",
  kind: "FittableRows",
  fit: true,
  components: [
    {name: "form", kind: "LoginForm"}
  ]
});

enyo.kind({
  name: "LoginForm",
  kind: "onyx.Groupbox",
  style: "width: 300px; height: 300px; margin: auto auto; ",
  components: [
    {kind: "onyx.GroupboxHeader", content: "Please Login"},
    {kind: "onyx.InputDecorator", components: [
      {name: "id", kind: "onyx.Input", placeholder: "User Identifier"}]},
    {kind: "onyx.InputDecorator", components: [
      {name: "password", kind: "onyx.Input", placeholder: "Password", type: "password"}]},
    {kind: "onyx.Button", content: "Login", ontap: "send"}
  ],
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
      console.warn("NO HANDLER FOR ERROR, BUT, THERE WAS AN ERROR", response.reason);
      return;
    }
    enyo.setCookie("xtsessioncookie", JSON.stringify(response), {
      secure: true,
      path: "/",
      domain: document.location.hostname === "localhost"? "": "." + document.location.hostname
    });
    //console.log(document.cookie);
    document.location = response.location;
  }
});