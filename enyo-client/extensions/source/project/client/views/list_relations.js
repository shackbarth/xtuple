/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.project.initListRelations = function () {

    // ..........................................................
    // ACCOUNT
    //

    enyo.kind({
      name: "XV.AccountProjectListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'dueDate', descending: true},
        {attribute: 'number' }
      ],
      parentKey: "account",
      workspace: "XV.ProjectWorkspace",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "getProjectStatusString", fit: true},
                {kind: "XV.ListAttr", attr: "dueDate", formatter: "formatDueDate",
                  placeholder: "_noCloseTarget".loc(),
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "name"}
            ]}
          ]}
        ]}
      ],
      formatDueDate: XV.ProjectList.prototype.formatDueDate
    });

    // ..........................................................
    // CONTACT
    //

    enyo.kind({
      name: "XV.ContactProjectListRelations",
      kind: "XV.AccountProjectListRelations",
      parentKey: "contact"
    });

    // ..........................................................
    // PROJECT
    //

    enyo.kind({
      name: "XV.ProjectTaskListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "number"}
      ],
      parentKey: "project",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                  formatter: "formatDueDate",
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "name"}
            ]},
            {kind: "XV.ListColumn", classes: "third",
              components: [
              {kind: "XV.ListAttr", attr: "getProjectStatusString"},
              {kind: "XV.ListAttr", attr: "owner.username"}
            ]},
            {kind: "XV.ListColumn", style: "width: 80;",
              components: [
              {content: "_budgeted".loc() + ":", classes: "xv-list-attr",
                style: "text-align: right;"},
              {content: "_actual".loc() + ":", classes: "xv-list-attr",
                style: "text-align: right;"},
              {content: "_balance".loc() + ":", classes: "xv-list-attr",
                style: "text-align: right;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "budgetedExpenses",
                classes: "text-align-right", formatter: "formatExpenses"},
              {kind: "XV.ListAttr", attr: "actualExpenses",
                classes: "text-align-right", formatter: "formatExpenses"},
              {kind: "XV.ListAttr", attr: "balanceExpenses",
                classes: "text-align-right", formatter: "formatBalanceExpenses"}
            ]},
            {kind: "XV.ListColumn", classes: "money", fit: true, components: [
              {kind: "XV.ListAttr", attr: "budgetedHours",
                classes: "text-align-right", formatter: "formatHours"},
              {kind: "XV.ListAttr", attr: "actualHours",
                classes: "text-align-right", formatter: "formatHours"},
              {kind: "XV.ListAttr", attr: "balanceHours",
                classes: "text-align-right", formatter: "formatBalanceHours"}
            ]}
          ]}
        ]}
      ],
      formatBalanceExpenses: function (value, view, model) {
        var actual = model.get('actualExpenses'),
          budget = model.get('budgetedExpenses');
        return this.formatExpenses(budget - actual, view);
      },
      formatBalanceHours: function (value, view, model) {
        var actual = model.get('actualHours'),
          budget = model.get('budgetedHours');
        return this.formatHours(budget - actual, view);
      },
      formatDueDate: XV.ProjectList.prototype.formatDueDate,
      formatHours: XV.ProjectList.prototype.formatHours,
      formatExpenses: XV.ProjectList.prototype.formatExpenses
    });

    enyo.kind({
      name: "XV.ProjectWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "project",
    });

    enyo.kind({
      name: "XV.ProjectTypeWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "project"
    });

    // ..........................................................
    // TASK RESOURCE
    //

    enyo.kind({
      name: "XV.TaskResourceListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'percent' } // XXX
      ],
      parentKey: "task",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "resource.code", classes: "bold"},
                {kind: "XV.ListAttr", attr: "percent", fit: true,
                  formatter: "formatPercent", classes: "right"},
              ]},
              {kind: "XV.ListAttr", attr: "resource.name"},
            ]}
          ]}
        ]}
      ],
      formatPercent: function (value) {
        return Globalize.format(value, "p" + XT.locale.percentScale);
      }
    });


  };
}());
