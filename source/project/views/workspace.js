/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initWorkspaces = function () {
    var extensions;
 
    // ..........................................................
    // ACCOUNT
    //
  
    extensions = [
      {kind: "XV.AccountProjectsBox", container: "panels",
        attr: "projectRelations"}
    ];

    XV.appendExtension("XV.AccountWorkspace", extensions);
  
    // ..........................................................
    // CONTACT
    //
  
    extensions = [
      {kind: "XV.ContactProjectsBox", container: "panels",
        attr: "projectRelations"}
    ];

    XV.appendExtension("XV.ContactWorkspace", extensions);

    // ..........................................................
    // INCIDENT
    //
  
    extensions = [
      {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
    ];

    XV.appendExtension("XV.IncidentWorkspace", extensions);
  
    // ..........................................................
    // PROJECT
    //
  
    extensions = [
      {kind: "XV.ProjectIncidentsBox", container: "panels", attr: "incidentRelations"}
    ];

    XV.appendExtension("XV.ProjectWorkspace", extensions);
  };

}());
