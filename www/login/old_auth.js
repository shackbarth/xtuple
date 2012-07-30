enyo.kind({
  name: "App",
  classes: "onyx",
  kind: "FittableRows",
  fit: true,
  published: {
    session: null
  },
  components: [
    {name: "wrapper", kind: "Panels", fit: true, components: [
      {name: "form", kind: "LoginForm"},
      {name: "selection", kind: "OrganizationSelector"}]}
  ],
  setCookie: function (response) {
    enyo.setCookie("xtsessioncookie", JSON.stringify(response), {
      secure: true,
      path: "/",
      // for development -- but should be changed prior to production
      domain: document.location.hostname === "localhost"? "": "." + document.location.hostname
    });
  },
  start: function () {
    this.renderInto(document.body);
  }
});

enyo.kind({
  name: "OrganizationSelector",
  published: {
    organizations: null
  },
  components: [
    {kind: "onyx.Toolbar", content: "Select Organization"},
    {name: "list", kind: "List", onSetupItem: "setupItem", components: [
      {name: "item", ontap: "rowTapped", style: "margin: 10px; "}]}
  ],
  setupItem: function (inSender, inEvent) {
    var idx = inEvent.index, name = this.getOrganizations()[idx].name;
    this.$.item.setContent(name);
  },
  rowTapped: function (row, inEvent) {
    var idx = inEvent.index, selection, x, data = this.owner.getSession();
    selection = this.getOrganizations()[idx].name;
    x = new enyo.Ajax({
      url: "selection",
      method: "POST"
    });
    data.selected = selection;
    this.log("selection: ", selection, " data: ", data);
    x.go(JSON.stringify(data));
    x.response(this, "didReceiveResponse");
  },
  didReceiveResponse: function (ignore, response) {
    this.log(response);
    if (response.isError) {
      console.warn("NO HANDLER YET BUT THERE WAS AN ERROR: ", response);
    } else {
      this.owner.setCookie(response);
      document.location = response.loc;
    }
  },
  organizationsChanged: function () {
    var organizations = this.getOrganizations();
    this.$.list.setCount(organizations.length);
    this.$.list.reset();
  }
});

enyo.kind({
  name: "LoginForm",
  kind: "onyx.Groupbox",
  create: function () {
    var c = enyo.getCookie("xtsessioncookie");
    this.inherited(arguments);
    if (!c) return;
    c = JSON.parse(c);
    this.$.id.setValue(c.id); 
  },
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
    this.owner.setCookie(response);
    //console.log(document.cookie);
    this.owner.setSession(response);
    this.owner.$.selection.setOrganizations(response.organizations);
    this.parent.setIndex(1);
  }
});

function startup() {
  var c = enyo.getCookie("xtsessioncookie"), validate;
  validate = function (session) {
    var h, x = new enyo.Ajax({
      url: "/session",
      method: "POST"
    });
    x.go(session);
    x.response(function (ignore, res) {
      console.log("validation: ", res);
      if (res && res.code && res.code === 1) {
        h = document.location.hostname;
        document.location = "https://" + h + "/client";
      } else app.start();
    });
  };
  if (!c) app.start();
  else validate(c);
}
