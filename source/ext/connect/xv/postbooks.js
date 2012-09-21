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
    {name: "incidentEmailProfile", kind: "XV.IncidentEmailProfileList"}
  ];

  XV.Postbooks.appendPanels("setup", panels);

}());
