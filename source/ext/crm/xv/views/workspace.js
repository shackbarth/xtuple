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
      attr: "incidentRelations"},
    {kind: "XV.AccountProjectsBox", container: "panels",
      attr: "projectRelations"}
  ];

  XV.appendWorkspaceExtension("XV.AccountWorkspace", extensions);

  // ..........................................................
  // INCIDENT
  //
  
  extensions = [
    {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"},
    {kind: "XV.IncidentToDosBox", container: "panels", attr: "toDoRelations"}
  ];

  XV.appendWorkspaceExtension("XV.IncidentWorkspace", extensions);
  
  // ..........................................................
  // OPPORTUNITY
  //

  extensions = [
    {kind: "XV.OpportunityToDosBox", container: "panels", attr: "toDoRelations"}
  ];

  XV.appendWorkspaceExtension("XV.OpportunityWorkspace", extensions);
  
  // ..........................................................
  // PROJECT
  //
  
  extensions = [
    {kind: "XV.ProjectIncidentsBox", container: "panels", attr: "incidentRelations"}
  ];

  XV.appendWorkspaceExtension("XV.ProjectWorkspace", extensions);

  // ..........................................................
  // TO DO
  //

  extensions = [
    {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
    {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
  ];

  XV.appendWorkspaceExtension("XV.ToDoWorkspace", extensions);

}());
