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
      {name: "resourceBudgetedHours", label: "_resources".loc() + " " + "_budgetedHours".loc(),
        item: "XV.ResourceBudgetedHoursBarChart"},
      {name: "resourceActualHours", label: "_resources".loc() + " " + "_actualHours".loc(),
        item: "XV.ResourceActualHoursBarChart"},
      {name: "resourceBalanceHours", label: "_resources".loc() + " " + "_balanceHours".loc(),
        item: "XV.ResourceBalanceHoursBarChart"},
      {name: "taskBudgetedHours", label: "_task".loc() + " " + "_budgetedHours".loc(),
        item: "XV.TaskBudgetedHoursTimeSeriesChart"},
      {name: "taskActualHours", label: "_task".loc() + " " + "_actualHours".loc(),
        item: "XV.TaskActualHoursTimeSeriesChart"},
      {name: "taskBudgetedExpenses", label: "_task".loc() + " " + "_budgetedExpenses".loc(),
        item: "XV.TaskBudgetedExpensesTimeSeriesChart"},
      {name: "taskActualExpenses", label: "_task".loc() + " " + "_actualExpenses".loc(),
        item: "XV.TaskActualExpensesTimeSeriesChart"},
      {name: "projectBudgetedHours", label: "_budgeted".loc() + " " + "_hours".loc(),
        item: "XV.ProjectBudgetedHoursBarChart"},
      {name: "projectActualHours", label: "_actual".loc() + " " + "_hours".loc(),
        item: "XV.ProjectActualHoursBarChart"},
      {name: "projectBudgetedExpenses", label: "_budgeted".loc() + " " + "_expenses".loc(),
        item: "XV.ProjectBudgetedExpensesBarChart"},
      {name: "projectActualExpenses", label: "_actual".loc() + " " + "_expenses".loc(),
        item: "XV.ProjectActualExpensesBarChart"},
    ]
  });
}());
