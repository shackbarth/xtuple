/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.incidentPlus.initWorkspaces = function () {
    var extensions,
      proto,
      controlValueChanged,
      statusChanged;

    // ..........................................................
    // INCIDENT
    //
  
    extensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_version".loc()},
      {kind: "XV.ProjectVersionPicker", container: "mainGroup", name: "foundIn",
        attr: "foundIn"},
      {kind: "XV.ProjectVersionPicker", container: "mainGroup", name: "fixedIn",
        attr: "fixedIn"}
    ];

    XV.appendExtension("XV.IncidentWorkspace", extensions);

    // Add special handling for project changing
    proto = XV.IncidentWorkspace.prototype;
    controlValueChanged = proto.controlValueChanged;
    statusChanged = proto.statusChanged;
    proto.statusChanged = function () {
      statusChanged.apply(this, arguments);
      this.projectChanged();
    };
    proto.controlValueChanged = function (inSender, inEvent) {
      controlValueChanged.apply(this, arguments);
      if (inEvent.originator.name === 'projectWidget') {
        this.projectChanged();
      }
    };
    proto.projectChanged = function () {
      var project = this.$.projectWidget.getValue(),
        value = this.getValue();
      this.$.foundIn.setProject(project);
      this.$.fixedIn.setProject(project);
      this.$.foundIn.setValue(value.get('foundIn'));
      this.$.fixedIn.setValue(value.get('fixedIn'));
    };
  
    // ..........................................................
    // PROJECT
    //
  
    extensions = [
      {kind: "XV.ProjectVersionBox", container: "panels", attr: "versions"}
    ];

    XV.appendExtension("XV.ProjectWorkspace", extensions);
  };

}());
