/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.crm.initListRelationsBox = function () {

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
      name: "XV.AccountToDosBox",
      kind: "XV.ListRelationsBox",
      title: "_toDo".loc(),
      parentKey: "account",
      listRelations: "XV.AccountToDoListRelations",
      searchList: "XV.ToDoList"
    });

    // ..........................................................
    // CONTACT
    //

    enyo.kind({
      name: "XV.ContactIncidentsBox",
      kind: "XV.ListRelationsBox",
      title: "_incidents".loc(),
      parentKey: "contact",
      listRelations: "XV.ContactIncidentListRelations"
    });

    enyo.kind({
      name: "XV.ContactOpportunitiesBox",
      kind: "XV.ListRelationsBox",
      title: "_opportunities".loc(),
      parentKey: "contact",
      listRelations: "XV.ContactOpportunityListRelations",
      searchList: "XV.OpportunityList"
    });

    enyo.kind({
      name: "XV.ContactToDosBox",
      kind: "XV.ListRelationsBox",
      title: "_toDo".loc(),
      parentKey: "contact",
      listRelations: "XV.ContactToDoListRelations",
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
  };

}());
