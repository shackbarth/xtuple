/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict: false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.project.initCharacteristicWidgets = function () {

    // ..........................................................
    // PROJECT
    //

    enyo.kind({
      name: "XV.ProjectCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.ProjectCharacteristic",
      which: "isProjects"
    });

    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypeCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.ProjectTypeCharacteristic",
      which: "isProjects"
    });

    // ..........................................................
    // TASK
    //

    enyo.kind({
      name: "XV.TaskCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.ProjectTaskCharacteristic",
      which: "isTasks"
    });
  };

}());
