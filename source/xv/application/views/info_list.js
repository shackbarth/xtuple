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
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "number", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "primaryContact.phone", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "name"},
              {kind: "XV.InfoListAttr", attr: "primaryContact.primaryEmail",
                classes: "right"}
            ]}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "primaryContact.name", classes: "italic",
              placeholder: "_noContact".loc()},
            {kind: "XV.InfoListAttr", attr: "primaryContact.address.formatShort"}
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
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "name", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "jobTitle", fit: true,
                classes: "right"}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "phone"},
              {kind: "XV.InfoListAttr", attr: "primaryEmail", classes: "right"}
            ]}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "address.formatShort"}
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
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "number", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "updated", fit: true, formatter: "formatDate",
                classes: "right"}
            ]},
            {attr: "description", classes: "xv-infolist-attr"}
          ]},
          {kind: "XV.InfoListColumn", classes: "second", components: [
            {kind: "XV.InfoListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.InfoListColumn", classes: "third", components: [
            {kind: "XV.InfoListAttr", attr: "getIncidentStatusString",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.InfoListAttr", attr: "category.name",
              placeholder: "_noCategory".loc()}
          ]}
        ]}
      ]}
    ],
    formatDate: function (value, view, model) {
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
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "number", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "targetClose", fit: true,
                formatter: "formatTargetClose",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "XV.InfoListAttr", attr: "name"}
          ]},
          {kind: "XV.InfoListColumn", classes: "second",
            components: [
            {kind: "XV.InfoListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.InfoListColumn", classes: "third",
            components: [
            {kind: "XV.InfoListAttr", attr: "opportunityStage.name",
              placeholder: "_noStage".loc()},
            {kind: "XV.InfoListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()},
            {kind: "XV.InfoListAttr", attr: "opportunityType.name",
              placeholder: "_noType".loc()}
          ]}
        ]}
      ]}
    ],
    formatTargetClose: function (value, view, model) {
      var isLate = model && model.get('isActive') &&
        (XT.date.compareDate(value, new Date()) < 1);
      view.addRemoveClass("error", isLate);
      return view;
    }
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectInfoList",
    kind: "XV.InfoList2",
    published: {
      label: "_projects".loc(),
      collection: "XM.ProjectInfoCollection",
      query: {orderBy: [{ attribute: 'number' }] },
      parameterWidget: "XV.ProjectInfoParameters",
      workspace: "XV.ProjectWorkspace"
    },
    components: [
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "number", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate",
                placeholder: "_noCloseTarget".loc(),
                classes: "right"}
            ]},
            {kind: "XV.InfoListAttr", attr: "name"},
            {kind: "XV.InfoListAttr", attr: "account.name"}
          ]},
          {kind: "XV.InfoListColumn", classes: "second", fit: true,
            components: [
            {kind: "XV.InfoListAttr", attr: "getProjectStatusString",
              classes: "italic", placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "owner.username"}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        K = XM.Project,
        isLate = (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(view, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
    },
    formatHours: function (value, view, model) {
      return Globalize.format(value, "n" + 2) + " " + "_hrs".loc();
    },
    formatExpenses: function (value, view, model) {
      return Globalize.format(value, "c" + XT.MONEY_SCALE);
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
    kind: "XV.InfoList2",
    published: {
      label: "_toDos".loc(),
      collection: "XM.ToDoInfoCollection",
      parameterWidget: "XV.ToDoInfoParameters",
      query: {orderBy: [
        {attribute: 'dueDate'},
        {attribute: 'name'}
      ]},
      workspace: "XV.ToDoWorkspace"
    },
    components: [
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.InfoListAttr", attr: "name", classes: "bold"},
              {kind: "XV.InfoListAttr", attr: "dueDate", fit: true,
                formatter: "formatDueDate", placeholder: "_noDueDate".loc(),
                classes: "right"}
            ]},
            {kind: "XV.InfoListAttr", attr: "description"}
          ]},
          {kind: "XV.InfoListColumn", classes: "second",
            components: [
            {kind: "XV.InfoListAttr", attr: "account.name", classes: "italic",
              placeholder: "_noAccountName".loc()},
            {kind: "XV.InfoListAttr", attr: "contact.name"}
          ]},
          {kind: "XV.InfoListColumn", classes: "third",
            components: [
            {kind: "XV.InfoListAttr", attr: "getToDoStatusString"},
            {kind: "XV.InfoListAttr", attr: "owner.username"}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "priority.name",
              placeholder: "_noPriority".loc()}
          ]}
        ]}
      ]}
    ],
    formatDueDate: function (value, view, model) {
      var today = new Date(),
        K = XM.ToDo,
        isLate = (model.get('status') !== K.COMPLETED &&
          XT.date.compareDate(value, today) < 1);
      view.addRemoveClass("error", isLate);
      return value;
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
    kind: "XV.InfoList2",
    published: {
      label: "_honorifics".loc(),
      collection: "XM.HonorificCollection",
      query: {orderBy: [{ attribute: 'code' }] },
      workspace: "XV.HonorificWorkspace"
    },
    components: [
      {kind: "XV.InfoListItem", components: [
        {kind: "XV.InfoListColumn", classes: "last", components: [
          {kind: "XV.InfoListAttr", attr: "code", classes: "bold"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // STATES AND COUNTRIES
  //
  
  enyo.kind({
    name: "XV.AbbreviationInfoList",
    kind: "XV.InfoList2",
    components: [
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "short",
            components: [
            {kind: "XV.InfoListAttr", attr: "abbreviation", classes: "bold"}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.StateList",
    kind: "XV.AbbreviationInfoList",
    published: {
      label: "_states".loc(),
      collection: "XM.StateCollection",
      query: {orderBy: [{ attribute: 'abbreviation' }] },
      workspace: "XV.StateWorkspace"
    }
  });

  enyo.kind({
    name: "XV.CountryList",
    kind: "XV.AbbreviationInfoList",
    published: {
      label: "_countries".loc(),
      collection: "XM.CountryCollection",
      query: {orderBy: [{ attribute: 'name' }] },
      workspace: "XV.CountryWorkspace"
    }
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
    kind: "XV.InfoList2",
    published: {
      query: {orderBy: [{ attribute: 'order' }] }
    },
    components: [
      {kind: "XV.InfoListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.InfoListColumn", classes: "short",
            components: [
            {kind: "XV.InfoListAttr", attr: "name", classes: "bold"}
          ]},
          {kind: "XV.InfoListColumn", classes: "last", fit: true, components: [
            {kind: "XV.InfoListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ],
    /**
     * All of these lists follow a very similar naming convention.
     * Apply that convention unless the list overrides the label
     * or collection attribute.
     */
    create: function () {
      this.inherited(arguments);
      var kindName = this.kind.substring(0, this.kind.length - 4).substring(3);
      if (!this.getLabel()) {
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
