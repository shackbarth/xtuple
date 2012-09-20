/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

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
  // ACCOUNT
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

}());
