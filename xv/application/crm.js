/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Crm",
    kind: "XV.Module",
    label: "_crm".loc(),
    lists: [
      {name: "accountInfoList", kind: "XV.AccountInfoList"},
      {name: "contactInfoList", kind: "XV.ContactInfoList"},
      {name: "toDoInfoList", kind: "XV.ToDoInfoList"},
      {name: "opportunityInfoList", kind: "XV.OpportunityInfoList"},
      {name: "incidentInfoList", kind: "XV.IncidentInfoList"},
      {name: "projectInfoList", kind: "XV.ProjectInfoList"}
    ]
  });

}());
