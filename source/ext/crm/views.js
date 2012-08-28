/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XV.Postbooks.addModule(
    {name: "crm", label: "_crm".loc(), panels: [
      {name: "accountList", kind: "XV.AccountList"},
      {name: "contactList", kind: "XV.ContactList"},
      {name: "toDoList", kind: "XV.ToDoList"},
      {name: "opportunityList", kind: "XV.OpportunityList"},
      {name: "incidentList", kind: "XV.IncidentList"},
      {name: "projectList", kind: "XV.ProjectList"}
    ]}, 1
  );

}());
