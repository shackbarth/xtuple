/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.project.initDependenciesWidgets = function () {

    // ..........................................................
    // PROJECT WORKFLOW DEPENDENCIES
    //

    enyo.kind({
      name: "XV.ProjectWorkflowSuccessorsWidget",
      kind: "XV.DependenciesWidget",
      model: "XM.ProjectWorkflowSuccessor"
    });

  };

}());
