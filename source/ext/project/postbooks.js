/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initPostbooks = function () {
    var module;

    // ..........................................................
    // APPLICATION
    //

    module = {
      name: "project",
      label: "_project".loc(),
      panels: [
        {name: "projectList", kind: "XV.ProjectList"},
        {name: "projectTaskList", kind: "XV.ProjectTaskList"}
      ],
      privileges: [
        "ProjectPriv1",
        "ProjectPriv2"
      ]
    };

    // TODO: the index should be the one above setup.
    XT.app.$.postbooks.insertModule(module, 2);
  };

}());
