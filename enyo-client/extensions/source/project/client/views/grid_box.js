/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initGridBox = function () {

    // ..........................................................
    // PROJECT
    //

    enyo.kind({
      name: "XV.ProjectTasksGridBox",
      kind: "XV.GridBox",
      classes: "large-panel",
      title: "_tasks".loc(),
      columns: [
        {classes: "grid-item", content: "_number".loc(), rows: [
          {readOnlyAttr: "number",
            editor: {kind: "XV.InputWidget", attr: "number",
              placeholder: "number".loc()}},
          {readOnlyAttr: "name",
            editor: {kind: "XV.InputWidget", attr: "name",
              placeholder: "name".loc()}}
        ]},
        {classes: "user", content: "_user".loc(), rows: [
          {readOnlyAttr: "owner.username",
            editor: {kind: "XV.UserAccountWidget", attr: "owner"}},
          {readOnlyAttr: "assignedTo.username",
            editor: {kind: "XV.UserAccountWidget", attr: "assignedTo"}},
        ]},
        {classes: "quantity", content: "_hours".loc(), rows: [
          {readOnlyAttr: "budgetedHours",
            editor: {kind: "XV.HoursWidget", attr: "budgetedHours"}},
          {readOnlyAttr: "actualHours",
            editor: {kind: "XV.HoursWidget", attr: "actualHours"}}
        ]},
        {classes: "price", content: "_expenses".loc(), rows: [
          {readOnlyAttr: "budgetedExpenses",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "budgetedExpenses", currency: ""},
              currencyDisabled: true, currencyShowing: false}},
          {readOnlyAttr: "actualExpenses",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "actualExpenses", currency: ""},
              currencyDisabled: true, currencyShowing: false}}
        ]},
        {classes: "date", content: "_scheduled".loc(), rows: [
          {readOnlyAttr: "startDate",
            editor: {kind: "XV.DateWidget", attr: "startDate"}},
          {readOnlyAttr: "dueDate",
            editor: {kind: "XV.DateWidget", attr: "dueDate"}}
        ]},
        {classes: "date", content: "_actualDate".loc(), rows: [
          {readOnlyAttr: "assignDate",
            editor: {kind: "XV.DateWidget", attr: "assignDate"}},
          {readOnlyAttr: "completeDate",
            editor: {kind: "XV.DateWidget", attr: "completeDate"}}
        ]}
      ],
      workspace: "XV.ProjectTaskWorkspace"
    });

  };

}());
