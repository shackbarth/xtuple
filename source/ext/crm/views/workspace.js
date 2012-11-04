/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
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
      name: "XV.ConfigureCrmWorkspace",
      kind: "XV.Workspace",
      title: "_configureCrm".loc(),
      headerAttrs: ["number", "-", "name"],
      model: "XM.Account",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.AccountTypePicker", attr: "accountType"},
              {kind: "XV.AccountWidget", attr: "parent", label: "_parent".loc()},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "onyx.GroupboxHeader", content: "_primaryContact".loc()},
              {kind: "XV.ContactWidget", attr: "primaryContact",
                showAddress: true},
              {kind: "onyx.GroupboxHeader", content: "_secondaryContact".loc()},
              {kind: "XV.ContactWidget", attr: "secondaryContact",
                showAddress: true},
              {kind: "XV.AccountCharacteristicsWidget", attr: "characteristics"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
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
    // TO DO
    //

    extensions = [
      {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
      {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
    ];

    XV.appendExtension("XV.ToDoWorkspace", extensions);
  };

}());
