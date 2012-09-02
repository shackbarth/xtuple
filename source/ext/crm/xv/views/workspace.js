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
    title: "_toDos".loc(),
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

  extensions = [
    {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
  ];

  XV.appendExtension("XV.IncidentWorkspace", extensions);

  // ..........................................................
  // TO DO
  //

  extensions = [
    {kind: "XV.IncidentWidget", container: "mainGroup", attr: "incident"},
    {kind: "XV.OpportunityWidget", container: "mainGroup", attr: "opportunity"}
  ];

  XV.appendExtension("XV.ToDoWorkspace", extensions);

}());
