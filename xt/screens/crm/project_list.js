/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true, _:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.ProjectInfoList",
    kind: "XT.InfoList",
    rowClass: "XT.ProjectInfoCollectionRow"
  });

  enyo.kind({
    name: "XT.ProjectInfoCollectionRow",
    kind: "XT.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "cell-key project-number" },
        { name: "name", classes: "project-name" },
        { name: "account.name", classes: "project-account-name" }
      ],
      [
        { width: 120 },
        { name: "dueDate", classes: "cell-align-right project-due-date", formatter: "formatDueDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 70 },
        { name: "getProjectStatusString", classes: "project-status" },
        { name: "owner.username", classes: "project-owner-username" }
      ],
      [
        { width: 70 },
        { content: "budgeted:", style: "text-align: right;", isLabel: true },
        { content: "actual:", style: "text-align: right;", isLabel: true },
        { content: "balance:", style: "text-align: right;", isLabel: true }
      ],
      [
        { width: 80 },
        { name: "budgetedExpenses", classes: "cell-align-right project-budgeted-expenses", formatter: "formatExpenses" },
        { name: "actualExpenses", classes: "cell-align-right project-actual-expenses", formatter: "formatExpenses" },
        { name: "balanceExpenses", classes: "cell-align-right project-balance-expenses", formatter: "formatExpenses" }
      ],
      [
        { width: 80 },
        { name: "budgetedHours", classes: "cell-align-right project-budgeted-hours", formatter: "formatHours" },
        { name: "actualHours", classes: "cell-align-right project-actual-hours", formatter: "formatHours" },
        { name: "balanceHours", classes: "cell-align-right project-balance-hours", formatter: "formatHours" }
      ]
    ],
    formatDueDate: function (content, model, view) {
      var today = new Date(),
        K = XM.Project;
      if (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    },
    formatHours: function (content, model, view) {
      return Globalize.format(content, "n" + 2) + " " + "_hrs".loc();
    },
    formatExpenses: function (content, model, view) {
      return Globalize.format(content, "c" + XT.MONEY_SCALE);
    }
  });

}());