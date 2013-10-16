/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initListRelationsEditorBoxes = function () {
    var extensions;

    // ..........................................................
    // TASK
    //
  
    extensions = [
      {kind: "XV.TaskCharacteristicsWidget", container: "mainGroup",
        attr: "characteristics"}
    ];

    XV.appendExtension("XV.ProjectTaskEditor", extensions);

  };

}());
