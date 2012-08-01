
enyo.kind({
  name: "XV.OrganizationSelection",
  classes: "xv-organizations-selection",
  published: {
    organizations: null
  },
  components: [
    {kind: "onyx.Toolbar", content: "_selectOrganization".loc()},
    {name: "list", kind: "List", onSetupItem: "setupItem", components: [
      {name: "item", ontap: "rowTapped", classes: "xv-organization-row"}]}
  ],
  setupItem: function (inSender, inEvent) {
    var idx = inEvent.index, name = this.getOrganizations()[idx].name;
    this.$.item.setContent(name);
  },
  rowTapped: function (row, inEvent) {
    var idx = inEvent.index, selection, x, data = app.getSession();
    selection = this.getOrganizations()[idx].name;
    x = new enyo.Ajax({
      url: "selection",
      method: "POST"
    });
    data.selected = selection;
    //this.log("selection: ", selection, " data: ", data);
    x.go(JSON.stringify(data));
    x.response(this, "didReceiveResponse");
  },
  didReceiveResponse: function (ignore, response) {
    this.log(response);
    if (response.isError) {
      console.warn("NO HANDLER YET BUT THERE WAS AN ERROR: ", response);
    } else {
      //this.owner.setCookie(response);
      app.setCookie(response);
      document.location = response.loc;
    }
  },
  organizationsChanged: function () {
    var organizations = this.getOrganizations();
    this.$.list.setCount(organizations.length);
    this.$.list.reset();
  }
});