/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.crm.initListRelations = function () {
  
    // ..........................................................
    // ACCOUNT
    //
  
    enyo.kind({
      name: "XV.AccountIncidentListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'number', descending: true}
      ],
      parentKey: "account",
      workspace: "XV.IncidentWorkspace",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "getIncidentStatusString", fit: true},
                {kind: "XV.ListAttr", attr: "updated", formatter: "formatDate",
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ],
      formatDate: XV.IncidentList.prototype.formatDate
    });

    enyo.kind({
      name: "XV.AccountOpportunityListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'number', descending: true}
      ],
      parentKey: "account",
      workspace: "XV.OpportunityWorkspace",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "opportunityStage.name", fit: true},
                {kind: "XV.ListAttr", attr: "targetClose",
                  formatter: "formatTargetClose",
                  placeholder: "_noCloseTarget".loc(),
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "name"}
            ]}
          ]}
        ]}
      ],
      formatTargetClose: XV.OpportunityList.prototype.formatTargetClose
    });
  
    enyo.kind({
      name: "XV.AccountToDoListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'dueDate', descending: true},
        {attribute: 'name'}
      ],
      parentKey: "account",
      workspace: "XV.ToDoWorkspace",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "name", classes: "bold"},
                {kind: "XV.ListAttr", attr: "dueDate", fit: true,
                  formatter: "formatDueDate", placeholder: "_noDueDate".loc(),
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", attr: "description",
                placeholder: "_noDescription".loc()}
            ]}
          ]}
        ]}
      ],
      formatDueDate: XV.ToDoList.prototype.formatDueDate
    });
  
    // ..........................................................
    // CONTACT
    //
 
    enyo.kind({
      name: "XV.ContactIncidentListRelations",
      kind: "XV.AccountIncidentListRelations",
      parentKey: "contact"
    });
  
    enyo.kind({
      name: "XV.ContactOpportunityListRelations",
      kind: "XV.AccountOpportunityListRelations",
      parentKey: "contact"
    });
  
    enyo.kind({
      name: "XV.ContactToDoListRelations",
      kind: "XV.AccountToDoListRelations",
      parentKey: "contact"
    });
  
    // ..........................................................
    // INCIDENT
    //
  
    enyo.kind({
      name: "XV.IncidentToDoListRelations",
      kind: "XV.AccountToDoListRelations",
      parentKey: "incident"
    });
  
    // ..........................................................
    // OPPORTUNITY
    //
  
    enyo.kind({
      name: "XV.OpportunityToDoListRelations",
      kind: "XV.AccountToDoListRelations",
      parentKey: "opportunity"
    });
  };

}());
