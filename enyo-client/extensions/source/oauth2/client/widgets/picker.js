/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.oauth2.initPickers = function () {

    enyo.kind({
      name: "XV.Oauth2clientTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.oauth2clientTypes"
    });

  };
}());
