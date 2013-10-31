/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.ProjectHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_projects".loc(),
    groupByOptions: [
      { name: "status", content: "_status".loc() },
      { name: "account", content: "_account".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    totalField: "actualHours"
  });

  enyo.kind({
    name: "XV.ProjectBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_projects".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "account" },
      { name: "owner" },
      { name: "assignedTo" }
    ]
  });

  enyo.kind({
    name: "XV.TaskBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_tasks".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ]
  });

  enyo.kind({
    name: "XV.TaskTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_tasks".loc() + " " + "_dueDate".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    dateField: "dueDate",
    totalField: "actualHours"
  });
}());
