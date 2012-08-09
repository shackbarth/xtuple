/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_accounts".loc(),
      collection: "XM.AccountInfoCollection",
      query: {orderBy: [{ attribute: 'number' }] },
      rowClass: "XV.AccountInfoCollectionRow",
      parameterWidget: "XV.AccountInfoParameters",
      workspace: "XV.AccountWorkspace"
    }
  });

  enyo.kind({
    name: "XV.AccountInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "number", classes: "cell-key account-number" },
        { name: "name", classes: "account-name", placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "primaryContact.phone",
            classes: "cell-align-right account-primaryContact-phone" },
        { name: "primaryContact.primaryEmail",
            classes: "cell-align-right account-primaryContact-primaryEmail" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "primaryContact.name",
            classes: "cell-italic account-primaryContact-name",
            placeholder: "_noContact".loc() },
        { name: "primaryContact.address.formatShort",
            classes: "account-primaryContact-address" }
      ]
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_contacts".loc(),
      collection: "XM.ContactInfoCollection",
      query: {orderBy: [{
        attribute: 'lastName'
      }, {
        attribute: 'firstName'
      }]},
      rowClass: "XV.ContactInfoCollectionRow",
      parameterWidget: "XV.ContactInfoParameters",
      workspace: "XV.ContactWorkspace"
    }
  });

  enyo.kind({
    name: "XV.ContactInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "name", classes: "cell-key contact-name" },
        { name: "jobTitle", classes: "contact-job-title",
            placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "phone", classes: "cell-align-right contact-phone" },
        { name: "primaryEmail", classes: "cell-align-right contact-email" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "account.name", classes: "cell-italic contact-account-name",
            placeholder: "_noAccountName".loc() },
        { name: "address.formatShort", classes: "contact-account-name" }
      ]
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_incidents".loc(),
      collection: "XM.IncidentInfoCollection",
      rowClass: "XV.IncidentInfoCollectionRow",
      parameterWidget: "XV.IncidentInfoParameters",
      workspace: "XV.IncidentWorkspace"
    }
  });

  enyo.kind({
    name: "XV.IncidentInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 245 },
        { name: "number", classes: "cell-key incident-number" },
        { name: "description", classes: "cell incident-description" }
      ],
      [
        { width: 75 },
        { name: "updated", classes: "cell-align-right incident-updated",
           formatter: "formatDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic incident-account-name" },
        { name: "contact.getName", classes: "incident-contact-name" }
      ],
      [
        { width: 75 },
        { name: "getIncidentStatusString", classes: "incident-status" },
        { name: "owner.username", classes: "incident-owner-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "incident-priority",
           placeholder: "_noPriority".loc() },
        { name: "category.name", classes: "incident-category",
           placeholder: "_noCategory".loc() }
      ]
    ],
    formatDate: function (content, model, view) {
      var today = new Date();
      if (XT.date.compareDate(content, today)) {
        view.removeClass("bold");
      } else {
        view.addClass("bold");
      }
      return content;
    }
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityInfoList",
    kind: "XV.InfoList",
    published: {
      collection: "XM.OpportunityInfoCollection",
      label: "_opportunities".loc(),
      rowClass: "XV.OpportunityInfoCollectionRow",
      parameterWidget: "XV.OpportunityInfoParameters",
      workspace: "XV.OpportunityWorkspace"
    }
  });

  enyo.kind({
    name: "XV.OpportunityInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "cell-key opportunity-number" },
        { name: "name", classes: "opportunity-description" }
      ],
      [
        { width: 120 },
        { name: "targetClose", classes: "cell-align-right",
            formatter: "formatTargetClose",
            placeholder: "_noCloseTarget".loc() }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic opportunity-account-name" },
        { name: "contact.getName", classes: "opportunity-contact-name",
           placeholder: "_noContact".loc() }
      ],
      [
        { width: 75 },
        { name: "opportunityStage.name", classes: "opportunity-opportunityStage-name",
            placeholder: "_noStage".loc() },
        { name: "owner.username", classes: "opportunity-owner-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "opportunity-priority-name",
            placeholder: "_noPriority".loc() },
        { name: "opportunityType.name", classes: "opportunity-opportunityType-name",
            placeholder: "_noType".loc() }
      ]
    ],
    formatTargetClose: function (content, model, view) {
      var today = new Date();
      if (model.get('isActive') &&
          content && XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    }
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_projects".loc(),
      collection: "XM.ProjectInfoCollection",
      query: {orderBy: [{ attribute: 'number' }] },
      rowClass: "XV.ProjectInfoCollectionRow",
      parameterWidget: "XV.ProjectInfoParameters",
      workspace: "XV.ProjectWorkspace"
    }
  });

  enyo.kind({
    name: "XV.ProjectInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "cell-key project-number" },
        { name: "name", classes: "project-name" },
        { name: "account.name", classes: "project-account-name" }
      ],
      [
        { width: 120 },
        { name: "dueDate", classes: "cell-align-right project-due-date",
            formatter: "formatDueDate" }
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
        { name: "budgetedExpenses",
            classes: "cell-align-right project-budgeted-expenses",
            formatter: "formatExpenses" },
        { name: "actualExpenses",
            classes: "cell-align-right project-actual-expenses",
            formatter: "formatExpenses" },
        { name: "balanceExpenses",
            classes: "cell-align-right project-balance-expenses",
            formatter: "formatExpenses" }
      ],
      [
        { width: 80 },
        { name: "budgetedHours",
            classes: "cell-align-right project-budgeted-hours",
            formatter: "formatHours" },
        { name: "actualHours",
            classes: "cell-align-right project-actual-hours",
            formatter: "formatHours" },
        { name: "balanceHours",
            classes: "cell-align-right project-balance-hours",
            formatter: "formatHours" }
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

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_toDos".loc(),
      collection: "XM.ToDoInfoCollection",
      rowClass: "XV.ToDoInfoCollectionRow",
      parameterWidget: "XV.ToDoInfoParameters",
      query: {orderBy: [
        {attribute: 'dueDate'},
        {attribute: 'name'}
      ]},
      workspace: "XV.ToDoWorkspace"
    }
  });

  enyo.kind({
    name: "XV.ToDoInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 245 },
        { name: "name", classes: "cell-key toDo-name" },
        { name: "description", classes: "cell toDo-description" }
      ],
      [
        { width: 75 },
        { name: "dueDate", classes: "cell-align-right toDo-dueDate",
            formatter: "formatDueDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic toDo-account-name",
            placeholder: "_noAccountName".loc() },
        { name: "contact.getName", classes: "toDo-contact-name" }
      ],
      [
        { width: 75 },
        { name: "getToDoStatusString", classes: "toDo-status" },
        { name: "assignedTo.username", classes: "toDo-assignedTo-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "toDo-priority",
            placeholder: "_noPriority".loc() }
      ]
    ],
    formatDueDate: function (content, model, view) {
      var today = new Date(),
        K = XM.ToDo;
      if (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(content, today) < 1) {
        view.addClass("error");
      } else {
        view.removeClass("error");
      }
      return content;
    }
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountInfoList",
    kind: "XV.InfoList",
    published: {
      label: "_userAccounts".loc(),
      collection: "XM.UserAccountInfoCollection",
      query: {orderBy: [{ attribute: 'username' }] },
      rowClass: "XV.UserAccountInfoCollectionRow",
      workspace: "XV.UserAccountWorkspace"
    }
  });

  enyo.kind({
    name: "XV.UserAccountInfoCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "username", classes: "cell-key user-account-username" }
      ],
      [
        { width: 160 },
        { name: "propername", classes: "user-account-proper-name"  }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "isActive", classes: "cell-align-right user-account-active",
          formatter: "formatActive" }
      ]
    ],
    formatActive: function (content) {
      return content ? "_active".loc() : "";
    }
  });


  // ..........................................................
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificList",
    kind: "XV.InfoList",
    published: {
      label: "_honorifics".loc(),
      collection: "XM.HonorificCollection",
      query: {orderBy: [{ attribute: 'code' }] },
      rowClass: "XV.HonorificCollectionRow",
      workspace: "XV.HonorificWorkspace"
    }
  });

  enyo.kind({
    name: "XV.HonorificCollectionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "code", classes: "" }
      ]
    ]
  });


  // ..........................................................
  // STATES AND COUNTRIES
  //

  enyo.kind({
    name: "XV.StateList",
    kind: "XV.InfoList",
    published: {
      label: "_states".loc(),
      collection: "XM.StateCollection",
      query: {orderBy: [{ attribute: 'abbreviation' }] },
      rowClass: "XV.AbbreviationNameRow",
      workspace: "XV.StateWorkspace"
    }
  });

  enyo.kind({
    name: "XV.CountryList",
    kind: "XV.InfoList",
    published: {
      label: "_countries".loc(),
      collection: "XM.CountryCollection",
      query: {orderBy: [{ attribute: 'name' }] },
      rowClass: "XV.AbbreviationNameRow",
      workspace: "XV.CountryWorkspace"
    }
  });

  enyo.kind({
    name: "XV.AbbreviationNameRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "abbreviation", classes: "" }
      ],
      [
        { width: 160 },
        { name: "name", classes: "" }
      ]
    ]
  });

  // ..........................................................
  // INCIDENT CATEGORIES, RESOLUTIONS, SEVERITIES,
  // PRIORITIES,
  // OPPORTUNITY SOURCES, STAGES, TYPES,
  //
  // Basically anything whose rows are name and description
  //

  enyo.kind({
    name: "XV.NameDescriptionList",
    kind: "XV.InfoList",
    published: {
      label: "",
      collection: null,
      query: {orderBy: [{ attribute: 'order' }] },
      rowClass: "XV.NameDescriptionRow"
    },
    /**
     * All of these lists follow a very similar naming convention.
     * Apply that convention unless the list overrides the label
     * or collection attribute.
     */
    create: function () {
      this.inherited(arguments);
      var kindName = this.kind.substring(0, this.kind.length - 4).substring(3);
      if (!this.getLabel()) {
        // Pluralize - if this gets any more complicated, we should
        // pull in a pluralize function
        var label = "_" + kindName.camelize().pluralize();
        this.setLabel(label.loc());
      }
      if (!this.getCollection()) {
        this.setCollection("XM." + kindName + "Collection");
      }
      if (!this.getWorkspace()) {
        this.setWorkspace("XV." + kindName + "Workspace");
      }
    }
  });

  enyo.kind({
    name: "XV.IncidentCategoryList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentResolutionList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.IncidentSeverityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.PriorityList",
    kind: "XV.NameDescriptionList"
  });

  enyo.kind({
    name: "XV.OpportunitySourceList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityStageList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.OpportunityTypeList",
    kind: "XV.NameDescriptionList",
    published: {
      query: {orderBy: [{ attribute: 'name' }] }
    }
  });

  enyo.kind({
    name: "XV.NameDescriptionRow",
    kind: "XV.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "name", classes: "" }
      ],
      [
        { width: 160 },
        { name: "description", classes: "" }
      ]
    ]
  });

}());
