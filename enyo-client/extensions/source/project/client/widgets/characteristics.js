/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.AccountCharacteristic",
    which: "isProjects"
  });

  // ..........................................................
  // TASK
  //

  enyo.kind({
    name: "XV.TaskCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.ContactCharacteristic",
    which: "isTasks"
  });

}());
