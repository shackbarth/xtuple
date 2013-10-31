/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_actual$": "Actual $",
    "_actualHrs": "Actual Hrs.",
    "_budgeted$": "Budgeted $",
    "_budgetedHrs": "Budgeted Hrs.",
    "_completionAction": "Completion Action",
    "_due": "Due",
    "_nextProjectStatus": "Next Project Status",
    "_noChange": "No Change",
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
    "_projectWorkflow": "Project Workflow",
    "_start": "Start"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
