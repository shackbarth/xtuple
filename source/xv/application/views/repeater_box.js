/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  enyo.kind({
    name: "XV.ProjectTaskRepeaterBox",
    kind: "XV.RepeaterBox",
    published: {
      recordType: "XM.ProjectTask",
      columns: [
        {kind: "XV.Input", name: "tasks.number" },
        {kind: "XV.Input", name: "tasks.name" },
        {kind: "XV.Input", name: "tasks.notes", classes: "xv-wide-entry" },
        {kind: "XV.Date", name: "tasks.dueDate" }, // TODO: should be a date widget, sort of.
        {kind: "XV.Number", name: "tasks.actualHours" },
        {kind: "XV.Number", name: "tasks.actualExpenses" }
      ]
    }
  });
  enyo.kind({
    name: "XV.OpportunityCommentBox",
    kind: "XV.CommentBox",
    published: {
      recordType: "XM.OpportunityComment",
    }
  });
  enyo.kind({
    name: "XV.ProjectCommentBox",
    kind: "XV.CommentBox",
    published: {
      recordType: "XM.ProjectComment",
    }
  });
}());
