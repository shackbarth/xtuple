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
        {classes: "grid-item", header: ["_number".loc(), "_description".loc()],
          rows: [
          {readOnlyAttr: "number",
            editor: {kind: "XV.InputWidget", attr: "number",
              placeholder: "_number".loc()}},
          {readOnlyAttr: "name",
            editor: {kind: "XV.InputWidget", attr: "name",
              placeholder: "_name".loc()}},
          {readOnlyAttr: "getProjectStatusString",
            editor: {kind: "XV.ProjectStatusPicker", attr: "status"}}
        ]},
        {classes: "user", header: ["_owner".loc(), "_assignedTo".loc()],
          rows: [
          {readOnlyAttr: "owner.username",
            editor: {kind: "XV.UserAccountWidget", attr: "owner"}},
          {readOnlyAttr: "assignedTo.username",
            editor: {kind: "XV.UserAccountWidget", attr: "assignedTo"}},
        ]},
        {classes: "quantity", header: ["_budgetedHrs".loc(), "_actualHrs".loc()],
          rows: [
          {readOnlyAttr: "budgetedHours",
            editor: {kind: "XV.HoursWidget", attr: "budgetedHours"}},
          {readOnlyAttr: "actualHours",
            editor: {kind: "XV.HoursWidget", attr: "actualHours"}}
        ]},
        {classes: "price", header: ["_budgeted$".loc(), "_actual$".loc()],
          rows: [
          {readOnlyAttr: "budgetedExpenses",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "budgetedExpenses", currency: ""},
              currencyDisabled: true, currencyShowing: false}},
          {readOnlyAttr: "actualExpenses",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "actualExpenses", currency: ""},
              currencyDisabled: true, currencyShowing: false}}
        ]},
        {classes: "date", header: ["_start".loc(), "_due".loc()],
          rows: [
          {readOnlyAttr: "startDate",
            placeholder: "_noStartDate".loc(),
            editor: {kind: "XV.DateWidget", attr: "startDate"}},
          {readOnlyAttr: "dueDate",
            editor: {kind: "XV.DateWidget", attr: "dueDate"}}
        ]},
        {classes: "date", header: ["_assigned".loc(), "_completed".loc()],
          rows: [
          {readOnlyAttr: "assignDate",
            placeholder: "_noAssignDate".loc(),
            editor: {kind: "XV.DateWidget", attr: "assignDate"}},
          {readOnlyAttr: "completeDate",
            placeholder: "_noCompleteDate".loc(),
            editor: {kind: "XV.DateWidget", attr: "completeDate"}},
          {readOnlyAttr: "percentComplete",
            editor: {kind: "XV.PercentWidget", attr: "percentComplete"}},
        ]}
      ],
      workspace: "XV.ProjectTaskWorkspace"
    });

    enyo.kind({
      name: "XV.ProjectWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.ProjectWorkflowWorkspace"
    });

  };

}());
