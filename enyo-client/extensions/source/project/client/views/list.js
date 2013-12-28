/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, XM:true, Globalize:true, enyo:true*/

(function () {

  XT.extensions.project.initLists = function () {

    enyo.kind({
      name: "XV.TaskList",
      kind: "XV.List",
      label: "_tasks".loc(),
      collection: "XM.TaskListItemCollection",
      query: {orderBy: [
        {attribute: "dueDate"},
        {attribute: "number"}
      ]},
      parameterWidget: "XV.ProjectTaskListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true},
                {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                  formatter: "formatDueDate",
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "project.name"}
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
                classes: "text-align-right", formatter: "formatExpenses"}
            ]},
            {kind: "XV.ListColumn", classes: "money", fit: true, components: [
              {kind: "XV.ListAttr", attr: "budgetedHours",
                classes: "text-align-right", formatter: "formatHours"},
              {kind: "XV.ListAttr", attr: "actualHours",
                classes: "text-align-right", formatter: "formatHours"},
              {kind: "XV.ListAttr", attr: "balanceHours",
                classes: "text-align-right", formatter: "formatHours"}
            ]}
          ]}
        ]}
      ],
      formatDueDate: XV.ProjectList.prototype.formatDueDate,
      formatHours: XV.ProjectList.prototype.formatHours,
      formatExpenses: XV.ProjectList.prototype.formatExpenses
    });

    XV.registerModelList("XM.TaskListItem", "XV.TaskList");

    // ..........................................................
    // PROJECT EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.ProjectEmailProfileList",
      kind: "XV.EmailProfileList",
      label: "_projectEmailProfiles".loc(),
      collection: "XM.ProjectEmailProfileCollection"
    });

    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypeList",
      kind: "XV.List",
      label: "_projectTypes".loc(),
      collection: "XM.ProjectTypeCollection",
      query: {orderBy: [
        {attribute: "code"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });

  };

}());
