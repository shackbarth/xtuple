/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initParameters = function () {
    var extensions;
 
    // ..........................................................
    // INCIDENT
    //
  
    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {name: "project", label: "_project".loc(), attr: "project", defaultKind: "XV.ProjectWidget"}
    ];

    XV.appendExtension("XV.IncidentListParameters", extensions);
  };

}());
