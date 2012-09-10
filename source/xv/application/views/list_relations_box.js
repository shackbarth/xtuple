/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountContactsBox",
    kind: "XV.ListRelationsBox",
    title: "_contacts".loc(),
    parentKey: "account",
    listRelations: "XV.ContactListRelations",
    searchList: "XV.ContactList"
  });
  
  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectTasksBox",
    kind: "XV.ListRelationsBox",
    classes: "xv-project-tasks-box",
    title: "_projectTasks".loc(),
    parentKey: "project",
    listRelations: "XV.ProjectTaskListRelations"
  });

}());
