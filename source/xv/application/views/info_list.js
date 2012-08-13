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
    kind: "XV.InfoList2",
    published: {
      label: "_accounts".loc(),
      collection: "XM.AccountInfoCollection",
      query: {orderBy: [{ attribute: 'number' }] },
      parameterWidget: "XV.AccountInfoParameters",
      workspace: "XV.AccountWorkspace"
    },
    components: [
      {name: "item", classes: "xv-infolist-item", ontap: "itemTap",
        components: [
        {kind: "FittableColumns", components: [
          {classes: "xv-infolist-column first",
            hasAttributes: true, components: [
            {kind: "FittableColumns", components: [
              {attr: "number", classes: "xv-infolist-attr bold"},
              {attr: "primaryContact.phone", fit: true,
                classes: "xv-infolist-attr right"}
            ]},
            {kind: "FittableColumns", components: [
              {attr: "name", classes: "xv-infolist-attr"},
              {attr: "primaryContact.primaryEmail",
                classes: "xv-infolist-attr right"}
            ]}
          ]},
          {classes: "xv-infolist-column last", fit: true, components: [
            {attr: "primaryContact.name", classes: "xv-infolist-attr italic",
              placeholder: "_noContact".loc()},
            {attr: "primaryContact.address.formatShort",
              classes: "xv-infolist-attr"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactInfoList",
    kind: "XV.InfoList2",
    published: {
      label: "_contacts".loc(),
      collection: "XM.ContactInfoCollection",
      query: {orderBy: [{
        attribute: 'lastName'
      }, {
        attribute: 'firstName'
      }]},
      parameterWidget: "XV.ContactInfoParameters",
      workspace: "XV.ContactWorkspace"
    },
    components: [
      {name: "item", classes: "xv-infolist-item", ontap: "itemTap",
        components: [
        {kind: "FittableColumns", components: [
          {classes: "xv-infolist-column first",
            hasAttributes: true, components: [
            {kind: "FittableColumns", components: [
              {attr: "name", classes: "xv-infolist-attr bold"},
              {attr: "jobTitle", fit: true,
                classes: "xv-infolist-attr right"}
            ]},
            {kind: "FittableColumns", components: [
              {attr: "phone", classes: "xv-infolist-attr"},
              {attr: "primaryEmail",
                classes: "xv-infolist-attr right"}
            ]}
          ]},
          {classes: "xv-infolist-column last", fit: true, components: [
            {attr: "account.name", classes: "xv-infolist-attr italic",
              placeholder: "_noAccountName".loc()},
            {attr: "address.formatShort",
              classes: "xv-infolist-attr"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentInfoList",
    kind: "XV.InfoList2",
    published: {
      label: "_incidents".loc(),
      collection: "XM.IncidentInfoCollection",
      parameterWidget: "XV.IncidentInfoParameters",
      workspace: "XV.IncidentWorkspace"
    },
    components: [
      {name: "item", classes: "xv-infolist-item", ontap: "itemTap",
        components: [
        {kind: "FittableColumns", components: [
          {classes: "xv-infolist-column first",
            hasAttributes: true, components: [
            {kind: "FittableColumns", components: [
              {attr: "number", classes: "xv-infolist-attr bold"},
              {attr: "updated", fit: true, formatter: "formatDate",
                classes: "xv-infolist-attr right"}
            ]},
            {attr: "description", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column second", fit: true, components: [
            {attr: "account.name", classes: "xv-infolist-attr italic",
              placeholder: "_noAccountName".loc()},
            {attr: "contact.name", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column third", fit: true, components: [
            {attr: "getIncidentStatusString", classes: "xv-infolist-attr",
              placeholder: "_noAccountName".loc()},
            {attr: "owner.username", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column fourth", fit: true, components: [
            {attr: "priority.name", classes: "xv-infolist-attr",
              placeholder: "_noPriority".loc()},
            {attr: "category.name", classes: "xv-infolist-attr",
              placeholder: "_noCategory".loc()}
          ]}
        ]}
      ]}
    ],
    formatDate: function (model, value, view) {
      var isToday = !XT.date.compareDate(value, new Date());
      view.addRemoveClass("bold", isToday);
      return value;
    }
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityInfoList",
    kind: "XV.InfoList2",
    published: {
      collection: "XM.OpportunityInfoCollection",
      label: "_opportunities".loc(),
      parameterWidget: "XV.OpportunityInfoParameters",
      workspace: "XV.OpportunityWorkspace"
    },
    components: [
      {name: "item", classes: "xv-infolist-item", ontap: "itemTap",
        components: [
        {kind: "FittableColumns", components: [
          {classes: "xv-infolist-column first",
            hasAttributes: true, components: [
            {kind: "FittableColumns", components: [
              {attr: "number", classes: "xv-infolist-attr bold"},
              {attr: "targetClose", fit: true, formatter: "formatTargetClose",
                placeholder: "_noCloseTarget".loc(),
                classes: "xv-infolist-attr right"}
            ]},
            {attr: "name", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column second", fit: true, components: [
            {attr: "account.name", classes: "xv-infolist-attr italic",
              placeholder: "_noAccountName".loc()},
            {attr: "contact.name", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column third", fit: true, components: [
            {attr: "opportunityStage.name", classes: "xv-infolist-attr",
              placeholder: "_noStage".loc()},
            {attr: "owner.username", classes: "xv-infolist-attr"}
          ]},
          {classes: "xv-infolist-column fourth", fit: true, components: [
            {attr: "priority.name", classes: "xv-infolist-attr",
              placeholder: "_noPriority".loc()},
            {attr: "opportunityType.name", classes: "xv-infolist-attr",
              placeholder: "_noType".loc()}
          ]}
        ]}
      ]}
    ],
    formatTargetClose: function (model, value, view) {
      var isLate = model && model.get('isActive') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return view;
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
