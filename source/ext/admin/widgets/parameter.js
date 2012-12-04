/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

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
