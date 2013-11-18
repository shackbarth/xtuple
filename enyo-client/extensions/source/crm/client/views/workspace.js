/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.crm.initWorkspaces = function () {
    var extensions;


    // ..........................................................
    // ACCOUNT
    //

    extensions = [
      {kind: "XV.AccountToDosBox", container: "panels",
        attr: "toDoRelations"},
      {kind: "XV.AccountOpportunitiesBox", container: "panels",
        attr: "opportunityRelations"},
      {kind: "XV.AccountIncidentsBox", container: "panels",
        attr: "incidentRelations"}
    ];

    XV.appendExtension("XV.AccountWorkspace", extensions);

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.CrmWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_crm".loc(),
      model: "XM.Crm",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader",
                content: "_account".loc()},
              {kind: "XV.NumberPolicyPicker",
                attr: "CRMAccountNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.InputWidget", attr: "NextCRMAccountNumber",
                label: "_nextNumber".loc()},
              {kind: "onyx.GroupboxHeader",
                content: "_country".loc()},
              {kind: "XV.CountryPicker", attr: "DefaultAddressCountry",
                label: "_default".loc(), idAttribute: "name"},
              {kind: "XV.ToggleButtonWidget", attr: "StrictAddressCountry",
                label: "_limitToList".loc()},
              {kind: "onyx.GroupboxHeader", content: "_incident".loc()},
              {kind: "XV.InputWidget", attr: "NextIncidentNumber",
                label: "_nextNumber".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "IncidentsPublicPrivate",
                label: "_public".loc() + " " + "_flag".loc()},
              {kind: "XV.CheckboxWidget", attr: "IncidentPublicDefault",
                label: "_incidentDefaultPublic".loc()},
              {kind: "onyx.GroupboxHeader",
                content: "_incidentStatusColors".loc()},
              {kind: "XV.InputWidget", attr: "IncidentNewColor",
                label: "_new".loc()},
              {kind: "XV.InputWidget", attr: "IncidentFeedbackColor",
                label: "_feedback".loc()},
              {kind: "XV.InputWidget", attr: "IncidentConfirmedColor",
                label: "_confirmed".loc()},
              {kind: "XV.InputWidget", attr: "IncidentAssignedColor",
                label: "_assigned".loc()},
              {kind: "XV.InputWidget", attr: "IncidentResolvedColor",
                label: "_resolved".loc()},
              {kind: "XV.InputWidget", attr: "IncidentClosedColor",
                label: "_closed".loc()},
              {kind: "onyx.GroupboxHeader", content: "_opportunity".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "OpportunityChangeLog",
                label: "_changeLog".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // CONTACT
    //

    extensions = [
      {kind: "XV.ContactToDosBox", container: "panels",
        attr: "toDoRelations"},
      {kind: "XV.ContactOpportunitiesBox", container: "panels",
        attr: "opportunityRelations"},
      {kind: "XV.ContactIncidentsBox", container: "panels",
        attr: "incidentRelations"}
    ];

    XV.appendExtension("XV.ContactWorkspace", extensions);

    // ..........................................................
    // CUSTOMER
    //

    extensions = [
      {kind: "XV.AccountContactsBox", container: "panels",
        attr: "contactRelations", parentAttr: "account"},
      {kind: "XV.AccountToDosBox", container: "panels",
        attr: "toDoRelations", parentAttr: "account"},
      {kind: "XV.AccountOpportunitiesBox", container: "panels",
        attr: "opportunityRelations", parentAttr: "account"},
      {kind: "XV.AccountIncidentsBox", container: "panels",
        attr: "incidentRelations", parentAttr: "account"}
    ];

    XV.appendExtension("XV.CustomerWorkspace", extensions);

    XV.registerModelWorkspace("XM.CustomerContactRelation", "XV.ContactWorkspace");
    XV.registerModelWorkspace("XM.CustomerIncidentRelation", "XV.IncidentWorkspace");
    XV.registerModelWorkspace("XM.CustomerOpportunityRelation", "XV.OpportunityWorkspace");
    XV.registerModelWorkspace("XM.CustomerToDoRelation", "XV.ToDoWorkspace");

    // ..........................................................
    // INCIDENT
    //

    extensions = [
      {kind: "XV.IncidentToDosBox", container: "panels", attr: "toDoRelations"}
    ];

    XV.appendExtension("XV.IncidentWorkspace", extensions);

    // ..........................................................
    // OPPORTUNITY
    //

    extensions = [
      {kind: "XV.OpportunityToDosBox", container: "panels", attr: "toDoRelations"}
    ];

    XV.appendExtension("XV.OpportunityWorkspace", extensions);

    // ..........................................................
    // QUOTE
    //

    extensions = [
      {kind: "XV.OpportunityWidget", container: "settingsGroup", attr: "opportunity"}
    ];

    XV.appendExtension("XV.QuoteWorkspace", extensions);

    // ..........................................................
    // SALES ORDER
    //

    extensions = [
      {kind: "XV.OpportunityWidget", container: "settingsGroup", attr: "opportunity"}
    ];

    XV.appendExtension("XV.SalesOrderWorkspace", extensions);

    // ..........................................................
    // TO DO
    //

    extensions = [
      {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
      {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
    ];

    XV.appendExtension("XV.ToDoWorkspace", extensions);
  };

}());
