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
    name: "XV.AccountOpportunitiesBox",
    kind: "XV.ListRelationsBox",
    title: "_opportunities".loc(),
    parentKey: "account",
    listRelations: "XV.AccountOpportunityListRelations",
    searchList: "XV.OpportunityList"
  });
  
  enyo.kind({
    name: "XV.AccountIncidentsBox",
    kind: "XV.ListRelationsBox",
    title: "_incidents".loc(),
    parentKey: "account",
    listRelations: "XV.AccountIncidentListRelations",
    searchList: "XV.IncidentList"
  });
  
  extensions = [
    {kind: "XV.AccountOpportunitiesBox", container: "panels",
      attr: "opportunityRelations"},
    {kind: "XV.AccountIncidentsBox", container: "panels",
      attr: "incidentRelations"}
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
