/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.incidentPlus.initPickers = function () {
  
    // ..........................................................
    // PROJECT VERSION
    //

    enyo.kind({
      name: "XV.ProjectVersionPicker",
      kind: "XV.PickerWidget",
      collection: "XM.projectVersions",
      nameAttribute: "version",
      disabled: true,
      published: {
        project: null
      },
      orderBy: [
        {attribute: 'version'}
      ]
    });
  };

}());
