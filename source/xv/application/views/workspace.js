/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // BASE CLASS
  //

  enyo.kind({
    name: "XV.OrderedReferenceWorkspace",
    kind: "XV.Workspace",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"},
          {kind: "XV.NumberWidget", name: "order"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_account".loc(),
      model: "XM.Account"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.AccountTypeDropdown", name: "accountType"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_contact".loc(),
      model: "XM.Contact"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_name".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "XV.InputWidget", name: "firstName"},
          {kind: "XV.InputWidget", name: "middleName"},
          {kind: "XV.InputWidget", name: "lastName"},
          {kind: "XV.InputWidget", name: "suffix"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "jobTitle"},
          {kind: "XV.InputWidget", name: "primaryEmail"},
          {kind: "XV.InputWidget", name: "phone"},
          {kind: "XV.InputWidget", name: "alternate"},
          {kind: "XV.InputWidget", name: "fax"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.CountryWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_country".loc(),
      model: "XM.Country"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "abbreviation"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "currencyName"},
          {kind: "XV.InputWidget", name: "currencySymbol"},
          {kind: "XV.InputWidget", name: "currencyAbbreviation"},
          {kind: "XV.InputWidget", name: "currencyNumber"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // HONORIFIC
  //

  enyo.kind({
    name: "XV.HonorificWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_honorific".loc(),
      model: "XM.Honorific"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "code"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_incident".loc(),
      model: "XM.Incident"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "description"},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.IncidentCategoryDropdown", name: "category"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.InputWidget", name: "status"},
          {kind: "XV.PriorityDropdown", name: "priority"},
          {kind: "XV.IncidentSeverityDropdown", name: "severity"},
          {kind: "XV.IncidentResolutionDropdown", name: "resolution"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "relationships".loc()},
          {kind: "XV.ItemWidget", name: "item"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    published: {
      title: "_incidentCategory".loc(),
      model: "XM.IncidentCategory"
    }
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    published: {
      title: "_incidentResolution".loc(),
      model: "XM.IncidentResolution"
    }
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentSeverityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    published: {
      title: "_incidentSeverity".loc(),
      model: "XM.IncidentSeverity"
    }
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_opportunity".loc(),
      model: "XM.Opportunity"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.MoneyWidget", name: "amount"},
          {kind: "XV.PercentWidget", name: "probability"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "XV.OpportunityStageDropdown", name: "opportunityStage"},
          {kind: "XV.OpportunityTypeDropdown", name: "opportunityType"},
          {kind: "XV.OpportunitySourceDropdown", name: "opportunitySource"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "targetClose"},
          {kind: "XV.DateWidget", name: "actualClose"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //

  enyo.kind({
    name: "XV.OpportunitySourceWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_opportunitySource".loc(),
      model: "XM.OpportunitySource"
    }
  });

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStageWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_opportunityStage".loc(),
      model: "XM.OpportunityStage"
    }
  });

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypeWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_opportunityType".loc(),
      model: "XM.OpportunityType"
    }
  });

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    published: {
      title: "_priority".loc(),
      model: "XM.Priority"
    }
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_project".loc(),
      model: "XM.Project"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        /*
        {kind: "XV.WorkspaceBox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.ProjectStatusDropdown", name: "status"}
        ]},
        {kind: "XV.WorkspaceBox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "dueDate"},
          {kind: "XV.DateWidget", name: "completeDate"}
        ]},
        {kind: "XV.WorkspaceBox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"}
        ]},
        */
        // on top just for development
        {kind: "XV.RepeaterBox", classes: "xv-groupbox", name: "tasks", columns: [
          {kind: "XV.Input", name: "tasks.number" },
          {kind: "XV.Input", name: "tasks.name" },
          {kind: "XV.Input", name: "tasks.notes" },
          {kind: "XV.Date", name: "tasks.dueDate" },
          {kind: "XV.Number", name: "tasks.actualHours" },
          {kind: "XV.Number", name: "tasks.actualExpenses" }
        ]},
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // STATE
  //

  enyo.kind({
    name: "XV.StateWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_state".loc(),
      model: "XM.State"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "abbreviation"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.CountryDropdown", name: "country"}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_toDo".loc(),
      model: "XM.ToDo"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"},
          {kind: "XV.PriorityDropdown", name: "priority"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "dueDate"},
          {kind: "XV.DateWidget", name: "completeDate"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"},
          {kind: "XV.AccountWidget", name: "account"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_userAccount".loc(),
      model: "XM.UserAccount"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "XV.InputWidget", name: "properName"},
          {kind: "XV.InputWidget", name: "initials"},
          {kind: "XV.InputWidget", name: "email"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ]
  });

}());
