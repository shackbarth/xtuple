/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // CAMPAIGN
  //

  enyo.kind({
    name: "XV.CampaignParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_campaign".loc()},
      {name: "number", label: "_number".loc(), attr: "number"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // DATABASE SERVER
  //

  enyo.kind({
    name: "XV.DatabaseServerParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_databaseServer".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // ORGANIZATION
  //

  enyo.kind({
    name: "XV.OrganizationParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_organization".loc()},
      {name: "name", label: "_name".loc(), attr: "name"},
      {name: "description", label: "_description".loc(), attr: "description"}
    ]
  });

}());
