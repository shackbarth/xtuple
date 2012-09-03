/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {
 
  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountIncidentsBox",
    kind: "XV.ListRelationsBox",
    title: "_incidents".loc(),
    parentKey: "account",
    listRelations: "XV.AccountIncidentListRelations"
  });
  
  enyo.kind({
    name: "XV.AccountOpportunitiesBox",
    kind: "XV.ListRelationsBox",
    title: "_opportunities".loc(),
    parentKey: "account",
    listRelations: "XV.AccountOpportunityListRelations"
  });
  
  enyo.kind({
    name: "XV.AccountProjectsBox",
    kind: "XV.ListRelationsBox",
    title: "_projects".loc(),
    parentKey: "account",
    listRelations: "XV.AccountProjectListRelations",
    searchList: "XV.ProjectList"
  });
  
  enyo.kind({
    name: "XV.AccountToDosBox",
    kind: "XV.ListRelationsBox",
    title: "_toDo".loc(),
    parentKey: "account",
    listRelations: "XV.AccountToDoListRelations",
    searchList: "XV.ToDoList"
  });

  // ..........................................................
  // INCIDENT
  //
  
  enyo.kind({
    name: "XV.IncidentToDosBox",
    kind: "XV.AccountToDosBox",
    parentKey: "incident",
    listRelations: "XV.IncidentToDoListRelations"
  });
  
  // ..........................................................
  // OPPORTUNITY
  //
  
  enyo.kind({
    name: "XV.OpportunityToDosBox",
    kind: "XV.AccountToDosBox",
    parentKey: "opportunity",
    listRelations: "XV.OpportunityToDoListRelations"
  });
  
  // ..........................................................
  // PROJECT
  //
  
  enyo.kind({
    name: "XV.ProjectIncidentsBox",
    kind: "XV.AccountIncidentsBox",
    parentKey: "project",
    listRelations: "XV.ProjectIncidentListRelations"
  });

}());
