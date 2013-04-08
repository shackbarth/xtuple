/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //
  
  enyo.kind({
    name: "XV.CustomerGroupCustomerEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
      classes: "in-panel", style: "border-right: #aaa 1px solid;", components: [
        {kind: "XV.InputWidget", attr: "name", label: "_name".loc(), classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "description", label: "_description".loc(), classes: "editor-field"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.CustomerGroupCustomerBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_customerGroupCustomer".loc(),
    editor: "XV.CustomerGroupCustomerEditor",
    parentKey: "customer",
    listRelations: "XV.CustomerGroupCustomerListRelations",
    fitButtons: false
  });

}());
