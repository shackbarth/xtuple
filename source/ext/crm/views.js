/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  var extensions,
    panels,
    module;

  // ..........................................................
  // APPLICATION
  //

  panels = [
    {name: "stateList", kind: "XV.StateList"},
    {name: "countryList", kind: "XV.CountryList"},
    {name: "priorityList", kind: "XV.PriorityList"},
    {name: "honorificList", kind: "XV.HonorificList"},
    {name: "incidentCategoryList", kind: "XV.IncidentCategoryList"},
    {name: "incidentResoulutionList", kind: "XV.IncidentResolutionList"},
    {name: "incidentSeverityList", kind: "XV.IncidentSeverityList"},
    {name: "opportunitySourceList", kind: "XV.OpportunitySourceList"},
    {name: "opportunityStageList", kind: "XV.OpportunityStageList"},
    {name: "opportunityTypeList", kind: "XV.OpportunityTypeList"}
  ];

  XV.Postbooks.appendPanels("setup", panels);

  module = {
    name: "crm",
    label: "_crm".loc(),
    panels: [
      {name: "accountList", kind: "XV.AccountList"},
      {name: "contactList", kind: "XV.ContactList"},
      {name: "toDoList", kind: "XV.ToDoList"},
      {name: "opportunityList", kind: "XV.OpportunityList"},
      {name: "incidentList", kind: "XV.IncidentList"},
      {name: "projectList", kind: "XV.ProjectList"}
    ]
  };

  XV.Postbooks.insertModule(module, 1);

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
