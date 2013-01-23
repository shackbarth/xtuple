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
     classes: "xv-characteristic-relations-box",
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
