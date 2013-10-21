/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.project.initPickers = function () {

    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.projectTypes",
      showNone: false,
      nameAttribute: "code"
    });

  }

}());
