/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  var extensions;
 
  // ..........................................................
  // ACCOUNT
  //
  
  /**
    Must include a component called `list`.
    List must be of sub-kind `XV.ListRelations`.
    The `value` must be set to a collection of `XM.Info` models.
  */
  enyo.kind({
    name: "XV.AccountOpportunitiesBox",
    kind: "XV.ListRelationsBox",
    title: "_opportunities".loc(),
    parentKey: 'account',
    searchList: "XV.OpportunityList",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_opportunities".loc()},
      {kind: "XV.AccountOpportunityListRelations", name: "list",
        attr: "opportunityRelations", fit: true},
      {kind: 'FittableColumns', classes: "xv-groupbox-buttons", components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newRecord",
          content: "_new".loc(), classes: "xv-groupbox-button-left",
          disabled: true},
        {kind: "onyx.Button", name: "attachButton", onclick: "attachRecord",
          content: "_attach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "detachButton", onclick: "detachRecord",
          content: "_detach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "openButton", onclick: "openRecord",
          content: "_open".loc(), classes: "xv-groupbox-button-right",
          disabled: true, fit: true}
      ]}
    ]
  });
  
  extensions = [
    {kind: "XV.AccountOpportunitiesBox", container: "panels",
      attr: "opportunityRelations"}
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
