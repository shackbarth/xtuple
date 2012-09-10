/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  
  enyo.kind({
    name: "XV.ProjectTaskRepeaterBox",
    kind: "XV.RepeaterBox",
    classes: "xv-project-task-repeater-box",
    title: "_projectTasks".loc(),
    model: "XM.ProjectTask",
    repeaterBoxItem: "XV.ProjectTaskRepeaterBoxItem"
  });
  
  enyo.kind({
    name: "XV.ProjectTaskRepeaterBoxItem",
    kind: "XV.RepeaterBoxItem",
    classes: "xv-project-task-repeater-box-item",
    components: [
      {kind: "FittableRows", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InputWidget", attr: "number", showLabel: false,
            placeholder: "_number".loc() },
          {kind: "XV.InputWidget", attr: "name", showLabel: false,
            placeholder: "_name".loc(), fit: true }
        ]},
        {kind: "FittableColumns", components: [
          {kind: "XV.DateWidget", attr: "dueDate", showLabel: false,
            placeholder: "_dueDate".loc()},
          {kind: "XV.ProjectStatusPicker", attr: "status", showLabel: false}
        ]},
        {kind: "FittableColumns", components: [
          {kind: "XV.NumberWidget", attr: "actualHours", showLabel: false  },
          {kind: "XV.NumberWidget", attr: "actualExpenses", showLabel: false }
        ]}
      ]}
    ]
  });
  
}());
