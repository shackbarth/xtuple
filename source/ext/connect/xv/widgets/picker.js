/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */


(function () {
  "use strict";

  XT.extensions.connect.initPickers = function () {

    enyo.kind({
      name: "XV.IncidentEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.incidentEmailProfiles"
    });

  };

}());
