/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  var extensions;
 
  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountIncidentsBox",
    kind: "XV.ListRelationsBox",
    title: "_incidents".loc(),
    parentKey: "account",
    listRelations: "XV.AccountIncidentListRelations",
    searchList: "XV.IncidentList"
  });
  
  enyo.kind({
    name: "XV.AccountOpportunitiesBox",
    kind: "XV.ListRelationsBox",
    title: "_opportunities".loc(),
    parentKey: "account",
    listRelations: "XV.AccountOpportunityListRelations",
    searchList: "XV.OpportunityList"
  });
  
  enyo.kind({
    name: "XV.AccountProjectsBox",
    kind: "XV.ListRelationsBox",
    title: "_projects".loc(),
    parentKey: "account",
    listRelations: "XV.AccountProjectListRelations",
    searchList: "XV.ProjectList",
    canAttach: true
  });
  
  enyo.kind({
    name: "XV.AccountToDosBox",
    kind: "XV.ListRelationsBox",
    title: "_toDo".loc(),
    parentKey: "account",
    listRelations: "XV.AccountToDoListRelations",
    searchList: "XV.ToDoList",
    canAttach: true
  });
  
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

  XV.appendExtension("XV.AccountWorkspace", extensions);

  // ..........................................................
  // INCIDENT
  //
  
  enyo.kind({
    name: "XV.IncidentToDosBox",
    kind: "XV.AccountToDosBox",
    parentKey: "incident",
    listRelations: "XV.IncidentToDoListRelations"
  });

  extensions = [
    {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"},
    {kind: "XV.IncidentToDosBox", container: "panels", attr: "toDoRelations"}
  ];

  XV.appendExtension("XV.IncidentWorkspace", extensions);
  
  // ..........................................................
  // OPPORTUNITY
  //
  
  enyo.kind({
    name: "XV.OpportunityToDosBox",
    kind: "XV.AccountToDosBox",
    parentKey: "opportunity",
    listRelations: "XV.OpportunityToDoListRelations"
  });

  extensions = [
    {kind: "XV.OpportunityToDosBox", container: "panels", attr: "toDoRelations"}
  ];

  XV.appendExtension("XV.OpportunityWorkspace", extensions);
  
  // ..........................................................
  // PROJECT
  //
  
  enyo.kind({
    name: "XV.ProjectIncidentsBox",
    kind: "XV.AccountIncidentsBox",
    parentKey: "project",
    listRelations: "XV.ProjectIncidentListRelations",
    canAttach: true
  });

  extensions = [
    {kind: "XV.ProjectIncidentsBox", container: "panels", attr: "incidentRelations"}
  ];

  XV.appendExtension("XV.ProjectWorkspace", extensions);

  // ..........................................................
  // TO DO
  //

  extensions = [
    {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
    {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
  ];

  XV.appendExtension("XV.ToDoWorkspace", extensions);

}());
