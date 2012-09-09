/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  var extensions;
 
  // ..........................................................
  // ACCOUNT
  //
  
  extensions = [
    {kind: "XV.AccountProjectsBox", container: "panels",
      attr: "projectRelations"}
  ];

  XV.appendWorkspaceExtension("XV.AccountWorkspace", extensions);
  
  // ..........................................................
  // ACCOUNT
  //
  
  extensions = [
    {kind: "XV.ContactProjectsBox", container: "panels",
      attr: "projectRelations"}
  ];

  XV.appendWorkspaceExtension("XV.ContactWorkspace", extensions);

  // ..........................................................
  // INCIDENT
  //
  
  extensions = [
    {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
  ];

  XV.appendWorkspaceExtension("XV.IncidentWorkspace", extensions);
  
  // ..........................................................
  // PROJECT
  //
  
  extensions = [
    {kind: "XV.ProjectIncidentsBox", container: "panels", attr: "incidentRelations"}
  ];

  XV.appendWorkspaceExtension("XV.ProjectWorkspace", extensions);

}());
