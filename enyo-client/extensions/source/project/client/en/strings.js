/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_actual$": "Actual $",
    "_actualHrs": "Actual Hrs.",
    "_approved": "Approved",
    "_budgeted$": "Budgeted $",
    "_budgetedHrs": "Budgeted Hrs.",
    "_due": "Due",
    "_dueSet": "Calculate",
    "_dueOffset": "Offset Days",
    "_nextProjectStatus": "Next Project Status",
    "_noChange": "No Change",
    "_maintainProjectEmailProfiles": "Maintain Project Email Profiles",
    "_maintainProjectTypes": "Maintain Project Types",
    "_percentComplete": "Complete",
    "_project": "Project",
    "_projectAssignedTo": "Project Assigned To",
    "_projectEmailProfile": "Project Email Profile",
    "_projectEmailProfiles": "Project Email",
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
    "_projectUpdated": "The following project has been UPDATED",
    "_projectWorkflow": "Project Workflow",
    "_rejected": "Rejected",
    "_requireProjectAssignment": "Require Project Assignment",
    "_resource": "Resource",
    "_resources": "Resources",
    "_review": "Review",
    "_revision": "Revision",
    "_start": "Start",
    "_startSet": "Calculate",
    "_startOffset": "Offset Days",
    "_useProjects": "Use Projects"
  });

  if (typeof exports !== "undefined") {
    exports.language = lang;
  }
}());
