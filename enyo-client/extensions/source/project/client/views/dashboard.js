/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true */

(function () {

  enyo.kind({
    name: "XV.ProjectDashboard",
    kind: "XV.Dashboard",
    collection: "XM.UserChartCollection",
    // this tells the default query what extension to pull charts for
    extension: "project",
    // title is what show in the "add chart" picker on the
    // dashboard and the chart is the widget to be added
    newActions: [
      {name: "projects", label: "_projects".loc(), item: "XV.ProjectBarChart"},
      {name: "tasks", label: "_tasks".loc(), item: "XV.TaskBarChart"},
      {name: "taskDueDates", label: "_task".loc() + " " + "_dueDate".loc(), item: "XV.TaskTimeSeriesChart"},
      {name: "projectHours", label: "_hours".loc(), item: "XV.ProjectHoursBarChart"}
    ]
  });
}());
