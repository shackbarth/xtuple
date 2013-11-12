/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  enyo.kind({
    name: "XV.ResourceBudgetedHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.TaskResourceAnalysisCollection",
    chartTitle: "_resource".loc() + " " + "_budgetedHours".loc(),
    groupByOptions: [
      { name: "name" }
    ],
    totalField: "budgetedHours"
  });

  enyo.kind({
    name: "XV.ResourceActualHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.TaskResourceAnalysisCollection",
    chartTitle: "_resource".loc() + " " + "_actualHours".loc(),
    groupByOptions: [
      { name: "name" }
    ],
    totalField: "actualHours"
  });

  enyo.kind({
    name: "XV.ResourceBalanceHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.TaskResourceAnalysisCollection",
    chartTitle: "_resource".loc() + " " + "_balanceHours".loc(),
    groupByOptions: [
      { name: "name" }
    ],
    totalField: "balanceHours"
  });

  enyo.kind({
    name: "XV.ProjectBudgetedHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_project".loc() + " " + "_budgeted".loc() + " " + "_hours".loc(),
    groupByOptions: [
      { name: "status", content: "_status".loc() },
      { name: "account", content: "_account".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    totalField: "budgetedHours"
  });

  enyo.kind({
    name: "XV.ProjectActualHoursBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_project".loc() + " " + "_actual".loc() + " " + "_hours".loc(),
    groupByOptions: [
      { name: "status", content: "_status".loc() },
      { name: "account", content: "_account".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    totalField: "actualHours"
  });

  enyo.kind({
    name: "XV.ProjectBudgetedExpensesBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_project".loc() + " " + "_budgeted".loc() + " " + "_expenses".loc(),
    groupByOptions: [
      { name: "status", content: "_status".loc() },
      { name: "account", content: "_account".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    totalField: "budgetedExpenses"
  });

  enyo.kind({
    name: "XV.ProjectActualExpensesBarChart",
    kind: "XV.DrilldownBarChart",
    collection: "XM.ProjectListItemCollection",
    chartTitle: "_project".loc() + " " + "_actual".loc() + " " + "_expenses".loc(),
    groupByOptions: [
      { name: "status", content: "_status".loc() },
      { name: "account", content: "_account".loc() },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    totalField: "actualExpenses"
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
    name: "XV.TaskBudgetedHoursTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_task".loc() + " " + "_budgetedHours".loc() + " " + "_dueDate".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    dateField: "dueDate",
    totalField: "budgetedHours"
  });

  enyo.kind({
    name: "XV.TaskActualHoursTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_task".loc() + " " + "_actualHours".loc() + " " + "_dueDate".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    dateField: "dueDate",
    totalField: "actualHours"
  });

  enyo.kind({
    name: "XV.TaskBudgetedExpensesTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_task".loc() + " " + "_budgetedExpenses".loc() + " " + "_dueDate".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    dateField: "dueDate",
    totalField: "budgetedExpenses"
  });

  enyo.kind({
    name: "XV.TaskActualExpensesTimeSeriesChart",
    kind: "XV.TimeSeriesChart",
    collection: "XM.TaskListItemCollection",
    chartTitle: "_task".loc() + " " + "_actualExpenses".loc() + " " + "_dueDate".loc(),
    groupByOptions: [
      { name: "status" },
      { name: "project" },
      { name: "owner" },
      { name: "assignedTo" }
    ],
    dateField: "dueDate",
    totalField: "actualExpenses"
  });
}());
