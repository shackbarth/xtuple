/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {
  
  // ..........................................................
  // CHARACTERISTIC
  //
  enyo.kind({
    name: "XV.CharacteristicOptionEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
      classes: "in-panel", style: "border-right: #aaa 1px solid;", components: [
        {kind: "XV.InputWidget", attr: "value", classes: "editor-field"},
        {kind: "XV.NumberWidget", attr: "order", classes: "editor-field"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.CharacteristicOptionBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_options".loc(),
    editor: "XV.CharacteristicOptionEditor",
    parentKey: "characteristic",
    listRelations: "XV.CharacteristicOptionListRelations",
    fitButtons: false
  });

  // ..........................................................
  // CONTACT
  //
  enyo.kind({
    name: "XV.ContactEmailEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "email"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ContactEmailBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_emailAddresses".loc(),
    editor: "XV.ContactEmailEditor",
    parentKey: "contact",
    listRelations: "XV.ContactEmailListRelations"
  });
  
  // ..........................................................
  // CUSTOMER SHIP-TO
  //
  enyo.kind({
    name: "XV.CustomerShipToEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.CheckboxWidget", attr: "isActive"},
        {kind: "XV.CheckboxWidget", attr: "isDefault"},
        {kind: "XV.SalesRepPicker", attr: "salesRep"},
        {kind: "XV.NumberWidget", attr: "commission"},
        {kind: "XV.ShipZonePicker", attr: "shipZone"},
        {kind: "XV.TaxZonePicker", attr: "taxZone"},
        {kind: "XV.ShipViaPicker", attr: "shipVia"},
        {kind: "XV.ShippingChargePicker", attr: "shipCharge"},
        {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
        {kind: "XV.ContactWidget", attr: "contact", showAddress: true, label: "_name".loc()},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.CustomerShipToBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_shipTo".loc(),
    editor: "XV.CustomerShipToEditor",
    parentKey: "customer",
    listRelations: "XV.CustomerShipToListRelations",
    fitButtons: false
  });
  
  // ..........................................................
  // Tax Registrations
  //
  enyo.kind({
    name: "XV.TaxRegistrationEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.TaxAuthorityPicker", attr: "taxAuthority"},
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.TaxZonePicker", attr: "taxZone"},
        {kind: "XV.DateWidget", attr: "effective"},
        {kind: "XV.DateWidget", attr: "expires"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.TaxRegistrationBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_taxRegistration".loc(),
    editor: "XV.TaxRegistrationEditor",
    parentKey: "customer",
    listRelations: "XV.TaxRegistrationListRelations",
    fitButtons: false
  });

  // ..........................................................
  // PROJECT
  //
  enyo.kind({
    name: "XV.ProjectTaskEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.ProjectStatusPicker", attr: "status"},
        {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
        {kind: "XV.DateWidget", attr: "dueDate"},
        {kind: "XV.DateWidget", attr: "startDate"},
        {kind: "XV.DateWidget", attr: "assignDate"},
        {kind: "XV.DateWidget", attr: "completeDate"},
        {kind: "onyx.GroupboxHeader", content: "_hours".loc()},
        {kind: "XV.QuantityWidget", attr: "budgetedHours",
          label: "_budgeted".loc()},
        {kind: "XV.QuantityWidget", attr: "actualHours",
          label: "_actual".loc()},
        {kind: "onyx.GroupboxHeader", content: "_expenses".loc()},
        {kind: "XV.MoneyWidget", attr: "budgetedExpenses",
          label: "_budgeted".loc()},
        {kind: "XV.MoneyWidget", attr: "actualExpenses",
          label: "_actual".loc()},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {kind: "XV.UserAccountWidget", attr: "owner"},
        {kind: "XV.UserAccountWidget", attr: "assignedTo"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ProjectTasksBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-list-relations-box",
    title: "_projectTasks".loc(),
    editor: "XV.ProjectTaskEditor",
    parentKey: "project",
    listRelations: "XV.ProjectTaskListRelations",
    fitButtons: false
  });

}());
