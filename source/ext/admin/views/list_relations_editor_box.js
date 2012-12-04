/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // USER ORGANIZATIONS
  //
  
  enyo.kind({
    name: "XV.UserOrganizationsEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.OrganizationWidget", name: "organizationPicker", attr: "name", label: "_organization".loc()},
        {kind: "XV.InputWidget", attr: "username"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.UserOrganizationsBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-user-organizations-box",
    title: "_organizations".loc(),
    editor: "XV.UserOrganizationsEditor",
    parentKey: "user",
    listRelations: "XV.UserOrganizationListRelations"
  });

}());
