
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
      { name: "number", classes: "project-number" },
      { name: "name", classes: "project-name" },
      { name: "account.name", classes: "project-account-name" } 
    ],
    [
      { width: 120 },
      { name: "dueDate", classes: "project-due-date", formatter: "formatProjectDate" }
    ]
  ],
  rightColumn: [
    [
      { width: 70 },
      { name: "status", classes: "project-status" },
      { name: "owner.username", classes: "project-owner-username" }
    ],
    [
      { width: 90 },
      { content: "budgeted", style: "text-align: right;", isLabel: true },
      { content: "actual", style: "text-align: right;", isLabel: true }
    ],
    [
      { width: 160 },
      { name: "budgetedHoursTotal", classes: "project-budgeted-hours-total" },
      { name: "actualHoursTotal", classes: "project-actual-hours-total" }
    ]
  ],
  formatProjectDate: function(content, model) {
    return Globalize.format(new Date(content), 'd');
  }
});