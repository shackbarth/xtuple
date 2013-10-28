/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_project": "Project",
    "_projectAssignedTo": "Project Assigned To",
    "_projectManagement": "Project Management",
    "_projectOwner": "Project Owner",
    "_projectRelations": "Projects",
    "_projectStatus": "Project Status",
    "_projectTask": "Project Task",
    "_projectTasks": "Project Tasks",
    "_projectTaskStatus": "Project Task Status",
    "_projects": "Projects",
    "_projectType": "Project Type",
    "_projectTypes": "Project Types",
    "_projectWorkflow": "Project Workflow"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
