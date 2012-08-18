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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.AccountTypeDropdown", name: "accountType"},
          {kind: "XV.ContactWidget", name: "primaryContact"},
          {kind: "XV.ContactWidget", name: "secondaryContact"}
        ]},
        {kind: "XV.WorkspaceBox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.AccountCommentBox", name: "comments"}
        ]}
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "onyx.GroupboxHeader", content: "_name".loc()},
          {kind: "XV.InputWidget", name: "firstName"},
          {kind: "XV.InputWidget", name: "middleName"},
          {kind: "XV.InputWidget", name: "lastName"},
          {kind: "XV.InputWidget", name: "suffix"},
          {kind: "onyx.GroupboxHeader", content: "_information".loc()},
          {kind: "XV.InputWidget", name: "jobTitle"},
          {kind: "XV.InputWidget", name: "primaryEmail"},
          {kind: "XV.InputWidget", name: "phone"},
          {kind: "XV.InputWidget", name: "alternate"},
          {kind: "XV.InputWidget", name: "fax"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.UserAccountWidget", name: "owner"}
        ]},
        {kind: "XV.WorkspaceBox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ContactCommentBox", name: "comments"}
        ]}
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "description"},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.ContactWidget", name: "contact"},
          {kind: "XV.IncidentCategoryDropdown", name: "category"},
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.IncidentStatusDropdown", name: "status"},
          {kind: "XV.PriorityDropdown", name: "priority"},
          {kind: "XV.IncidentSeverityDropdown", name: "severity"},
          {kind: "XV.IncidentResolutionDropdown", name: "resolution"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.ItemWidget", name: "item"}
        ]},
        {kind: "XV.WorkspaceBox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.IncidentCommentBox", name: "comments"}
        ]}
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.ContactWidget", name: "contact"},
          {kind: "XV.MoneyWidget", name: "amount"},
          {kind: "XV.PercentWidget", name: "probability"},
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.OpportunityStageDropdown", name: "opportunityStage"},
          {kind: "XV.OpportunityTypeDropdown", name: "opportunityType"},
          {kind: "XV.OpportunitySourceDropdown", name: "opportunitySource"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "targetClose"},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "actualClose"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"}
        ]},
        {kind: "XV.WorkspaceBox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.OpportunityCommentBox", name: "comments"}
        ]}
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
        classes: "xv-top-panel", fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.ProjectStatusDropdown", name: "status"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "dueDate"},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.ContactWidget", name: "contact"}
        ]},
        {kind: "XV.WorkspaceBox",
          title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ProjectCommentBox", name: "comments"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_tasks".loc(), components: [
          {kind: "XV.ProjectTaskRepeaterBox", name: "tasks"}
        ]}
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
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
        fit: true, components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"},
          {kind: "XV.PriorityDropdown", name: "priority"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", name: "dueDate"},
          {kind: "XV.DateWidget", name: "startDate"},
          {kind: "XV.DateWidget", name: "assignDate"},
          {kind: "XV.DateWidget", name: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", name: "owner"},
          {kind: "XV.UserAccountWidget", name: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", name: "account"},
          {kind: "XV.ContactWidget", name: "contact"}
        ]},
        {kind: "XV.WorkspaceBox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", name: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ToDoCommentBox", name: "comments"}
        ]}
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
    handlers: {
      onRefreshPrivileges: "refreshPrivileges"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.UserAccountRoleWorkspaceBox", name: "grantedUserAccountRoles"},
        {kind: "XV.UserAccountPrivilegeWorkspaceBox", name: "grantedPrivileges"},
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.CheckboxWidget", name: "isActive"},
          {kind: "XV.InputWidget", name: "properName"},
          {kind: "XV.InputWidget", name: "initials"},
          {kind: "XV.InputWidget", name: "email"}
        ]},
      ]}
    ],
    refreshPrivileges: function (inSender, inEvent) {
      this.$.grantedPrivileges.mapIds();
      this.$.grantedPrivileges.tryToRender();
    }
  });

  // ..........................................................
  // USER ACCOUNT ROLE
  //

  enyo.kind({
    name: "XV.UserAccountRoleWorkspace",
    kind: "XV.Workspace",
    published: {
      title: "_userAccountRole".loc(),
      model: "XM.UserAccountRole"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.WorkspaceBox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"}
        ]},
        {kind: "XV.UserAccountRolePrivilegeWorkspaceBox", name: "grantedPrivileges"}
      ]}
    ]
  });

}());
