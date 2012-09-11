/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectTasksBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-project-tasks-box",
    title: "_projectTasks".loc(),
    editors: [
      {content: "Stuff", style: "background-color: #ddd; min-width: 310px"},
      {content: "More Stuff", style: "background-color: #fff; min-width: 310px"}
    ],
    parentKey: "project",
    listRelations: "XV.ProjectTaskListRelations"
  });

}());
