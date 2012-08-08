/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT TYPE
  //
  
  enyo.kind({
    name: "XV.AccountTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.accountTypes",
      valueAttribute: "id"
    }
  });

  // ..........................................................
  // COMMENT TYPE
  //
  
  enyo.kind({
    name: "XV.CommentTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.commentTypes"
    }
  });
  
  // ..........................................................
  // INCIDENT CATEGORY
  //
  
  enyo.kind({
    name: "XV.IncidentCategoryDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentCategories"
    }
  });
  
  // ..........................................................
  // INCIDENT RESOLUTION
  //
  
  enyo.kind({
    name: "XV.IncidentResolutionDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentResolutions"
    }
  });
  
  // ..........................................................
  // INCIDENT SEVERITY
  //
  
  enyo.kind({
    name: "XV.IncidentSeverityDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentSeverities"
    }
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //
  
  enyo.kind({
    name: "XV.OpportunitySourceDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunitySources"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY STAGE
  //
  
  enyo.kind({
    name: "XV.OpportunityStageDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunityStages"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY TYPE
  //
  
  enyo.kind({
    name: "XV.OpportunityTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunityTypes"
    }
  });
  
  // ..........................................................
  // PRIORITY
  //
  
  enyo.kind({
    name: "XV.PriorityDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.priorities"
    }
  });
  
  // ..........................................................
  // PROJECT STATUS
  //
  
  enyo.kind({
    name: "XV.ProjectStatusDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.projectStatuses",
      valueAttribute: "id"
    }
  });
  
}());
