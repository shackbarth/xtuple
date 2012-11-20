/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserWorkspace",
    kind: "XV.Workspace",
    title: "_user".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "id"},
            {kind: "XV.InputWidget", attr: "password"}
          ]}
        ]}
        // {kind: "XV.UserOrganizationSomethingorotherBox", attr: "organizations"} TODO
      ]}
    ],
    model: "XM.User"
  });

  XV.registerModelWorkspace("XM.User", "XV.UserWorkspace");

  // ..........................................................
  // DATABASE SERVER
  //

  enyo.kind({
    name: "XV.DatabaseServerWorkspace",
    kind: "XV.Workspace",
    title: "_databaseServer".loc(),
    model: "XM.DatabaseServer"
  });

  XV.registerModelWorkspace("XM.DatabaseServer", "XV.DatabaseServerWorkspace");

  // ..........................................................
  // ORGANIZATION
  //

  enyo.kind({
    name: "XV.OrganizationWorkspace",
    kind: "XV.Workspace",
    title: "_organization".loc(),
    model: "XM.Organization"
  });

  XV.registerModelWorkspace("XM.Organization", "XV.OrganizationWorkspace");



}());
