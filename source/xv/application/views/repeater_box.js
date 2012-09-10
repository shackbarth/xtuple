/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  
  enyo.kind({
    name: "XV.ProjectTaskRepeaterBox",
    kind: "XV.RepeaterBox",
    model: "XM.ProjectTask",
    columns: [
      {kind: "XV.Input", attr: "number" },
      {kind: "XV.Input", attr: "name" },
      {kind: "XV.Input", attr: "notes", classes: "xv-wide-entry" },
      {kind: "XV.DateWidget", attr: "dueDate" },
      {kind: "XV.Number", attr: "actualHours" },
      {kind: "XV.Number", attr: "actualExpenses" }
    ]
  });
  
}());
