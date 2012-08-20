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
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.NumberWidget", attr: "order"}
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
    title: "_account".loc(),
    model: "XM.Account",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "number"},
          {kind: "XV.CheckboxWidget", attr: "isActive"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.AccountTypeDropdown", attr: "accountType"},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "onyx.GroupboxHeader", content: "_primaryContact".loc()},
          {kind: "XV.ContactWidget", attr: "primaryContact"},
          {kind: "onyx.GroupboxHeader", content: "_secondaryContact".loc()},
          {kind: "XV.ContactWidget", attr: "secondaryContact"}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.AccountCommentBox", attr: "comments"}
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
    title: "_contact".loc(),
    model: "XM.Contact",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "number"},
          {kind: "XV.CheckboxWidget", attr: "isActive"},
          {kind: "onyx.GroupboxHeader", content: "_name".loc()},
          {kind: "XV.InputWidget", attr: "firstName"},
          {kind: "XV.InputWidget", attr: "middleName"},
          {kind: "XV.InputWidget", attr: "lastName"},
          {kind: "XV.InputWidget", attr: "suffix"},
          {kind: "onyx.GroupboxHeader", content: "_information".loc()},
          {kind: "XV.InputWidget", attr: "jobTitle"},
          {kind: "XV.InputWidget", attr: "primaryEmail"},
          {kind: "XV.InputWidget", attr: "phone"},
          {kind: "XV.InputWidget", attr: "alternate"},
          {kind: "XV.InputWidget", attr: "fax"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", attr: "account"},
          {kind: "XV.UserAccountWidget", attr: "owner"}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ContactCommentBox", attr: "comments"}
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
    title: "_country".loc(),
    model: "XM.Country",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "abbreviation"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "currencyName"},
          {kind: "XV.InputWidget", attr: "currencySymbol"},
          {kind: "XV.InputWidget", attr: "currencyAbbreviation"},
          {kind: "XV.InputWidget", attr: "currencyNumber"}
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
    title: "_honorific".loc(),
    model: "XM.Honorific",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "code"}
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
    title: "_incident".loc(),
    model: "XM.Incident",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "number"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.AccountWidget", attr: "account"},
          {kind: "XV.ContactWidget", attr: "contact"},
          {kind: "XV.IncidentCategoryDropdown", attr: "category"},
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.IncidentStatusDropdown", attr: "status"},
          {kind: "XV.PriorityDropdown", attr: "priority"},
          {kind: "XV.IncidentSeverityDropdown", attr: "severity"},
          {kind: "XV.IncidentResolutionDropdown", attr: "resolution"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.ItemWidget", attr: "item"}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.IncidentCommentBox", attr: "comments"}
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
    title: "_incidentCategory".loc(),
    model: "XM.IncidentCategory"
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentResolution".loc(),
    model: "XM.IncidentResolution"
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentSeverityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_incidentSeverity".loc(),
    model: "XM.IncidentSeverity"
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityWorkspace",
    kind: "XV.Workspace",
    title: "_opportunity".loc(),
    model: "XM.Opportunity",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "number"},
          {kind: "XV.CheckboxWidget", attr: "isActive"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.AccountWidget", attr: "account"},
          {kind: "XV.ContactWidget", attr: "contact"},
          {kind: "XV.MoneyWidget", attr: "amount"},
          {kind: "XV.PercentWidget", attr: "probability"},
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.OpportunityStageDropdown", attr: "opportunityStage"},
          {kind: "XV.OpportunityTypeDropdown", attr: "opportunityType"},
          {kind: "XV.OpportunitySourceDropdown", attr: "opportunitySource"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "targetClose"},
          {kind: "XV.DateWidget", attr: "startDate"},
          {kind: "XV.DateWidget", attr: "assignDate"},
          {kind: "XV.DateWidget", attr: "actualClose"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.OpportunityCommentBox", attr: "comments"}
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
    title: "_opportunitySource".loc(),
    model: "XM.OpportunitySource"
  });

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStageWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityStage".loc(),
    model: "XM.OpportunityStage"
  });

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypeWorkspace",
    kind: "XV.Workspace",
    title: "_opportunityType".loc(),
    model: "XM.OpportunityType"
  });

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityWorkspace",
    kind: "XV.OrderedReferenceWorkspace",
    title: "_priority".loc(),
    model: "XM.Priority"
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectWorkspace",
    kind: "XV.Workspace",
    title: "_project".loc(),
    model: "XM.Project",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "number"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.ProjectStatusDropdown", attr: "status"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "XV.DateWidget", attr: "startDate"},
          {kind: "XV.DateWidget", attr: "assignDate"},
          {kind: "XV.DateWidget", attr: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", attr: "account"},
          {kind: "XV.ContactWidget", attr: "contact"}
        ]},
        {kind: "XV.Groupbox",
          title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ProjectCommentBox", attr: "comments"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_tasks".loc(), components: [
          {kind: "XV.ProjectTaskRepeaterBox", attr: "tasks"}
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
    title: "_state".loc(),
    model: "XM.State",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "abbreviation"},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.CountryDropdown", attr: "country"}
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
    title: "_toDo".loc(),
    model: "XM.ToDo",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.PriorityDropdown", attr: "priority"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "XV.DateWidget", attr: "startDate"},
          {kind: "XV.DateWidget", attr: "assignDate"},
          {kind: "XV.DateWidget", attr: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
          {kind: "XV.AccountWidget", attr: "account"},
          {kind: "XV.ContactWidget", attr: "contact"}
        ]},
        {kind: "XV.Groupbox", title: "_notes".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes"}
        ]},
        {kind: "Scroller", horizontal: "hidden", title: "_comments".loc(), components: [
          {kind: "XV.ToDoCommentBox", attr: "comments"}
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
    title: "_userAccount".loc(),
    model: "XM.UserAccount",
    handlers: {
      onRefreshPrivileges: "refreshPrivileges"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.UserAccountRoleGroupbox", name: "grantedUserAccountRoles"},
        {kind: "XV.UserAccountPrivilegeGroupbox", name: "grantedPrivileges"},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.CheckboxWidget", attr: "isActive"},
          {kind: "XV.InputWidget", attr: "properName"},
          {kind: "XV.InputWidget", attr: "initials"},
          {kind: "XV.InputWidget", attr: "email"}
        ]}
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
    title: "_userAccountRole".loc(),
    model: "XM.UserAccountRole",
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, classes: "xv-top-panel", components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"}
        ]},
        {kind: "XV.UserAccountRolePrivilegeGroupbox", attr: "grantedPrivileges"}
      ]}
    ]
  });

}());
