/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.incidentPlus.initWorkspaces = function () {
    var extensions;
 

    // ..........................................................
    // INCIDENT
    //
  
    extensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_version".loc()},
      {kind: "XV.ProjectVersionPicker", container: "mainGroup", attr: "foundIn"},
      {kind: "XV.ProjectVersionPicker", container: "mainGroup", attr: "fixedIn"}
    ];

    XV.appendExtension("XV.IncidentWorkspace", extensions);
  
    // ..........................................................
    // PROJECT
    //
  
    extensions = [
      {kind: "XV.ProjectVersionBox", container: "panels", attr: "versions"}
    ];

    XV.appendExtension("XV.ProjectWorkspace", extensions);
  };

}());
