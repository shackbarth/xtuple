/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.incidentPlus.initParameters = function () {
    var extensions, proto, memoize;

    // ..........................................................
    // INCIDENT
    //

    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_version".loc()},
      {name: "foundIn", label: "_foundIn".loc(), attr: "foundIn", defaultKind: "XV.ProjectVersionPicker"},
      {name: "fixedIn", label: "_fixedIn".loc(), attr: "fixedIn", defaultKind: "XV.ProjectVersionPicker"}
    ];

    XV.appendExtension("XV.IncidentListParameters", extensions);

    // Add special handling for project changing
    proto = XV.IncidentListParameters.prototype;

    // memoize just happens to be the function that gets called when a parameter gets updated
    memoize = proto.memoize;
    proto.memoize = function (inSender, inEvent) {
      memoize.apply(this, arguments);
      if (inEvent.originator.name === 'project') {
        this.projectChanged();
      }
    };
    proto.projectChanged = function () {
      var project = this.$.project.getValue();
      this.$.foundIn.$.input.setProject(project);
      this.$.fixedIn.$.input.setProject(project);
    };
  };

}());
