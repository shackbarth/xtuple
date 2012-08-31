/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT TYPE
  //
  
  enyo.kind({
    name: "XV.AccountTypePicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.accountTypes",
      valueAttribute: "id"
    }
  });

  // ..........................................................
  // COMMENT TYPE
  //
  
  enyo.kind({
    name: "XV.CommentTypePicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.commentTypes"
    }
  });
  
  // ..........................................................
  // COUNTRY
  //
  
  enyo.kind({
    name: "XV.CountryPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.countries"
    }
  });
  
  // ..........................................................
  // INCIDENT CATEGORY
  //
  
  enyo.kind({
    name: "XV.IncidentCategoryPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.incidentCategories"
    }
  });
  
  // ..........................................................
  // INCIDENT RESOLUTION
  //
  
  enyo.kind({
    name: "XV.IncidentResolutionPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.incidentResolutions"
    }
  });
  
  // ..........................................................
  // INCIDENT SEVERITY
  //
  
  enyo.kind({
    name: "XV.IncidentSeverityPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.incidentSeverities"
    }
  });
  
  // ..........................................................
  // INCIDENT STATUS
  //
  
  enyo.kind({
    name: "XV.IncidentStatusPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.incidentStatuses",
      valueAttribute: "id"
    }
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //
  
  enyo.kind({
    name: "XV.OpportunitySourcePicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.opportunitySources"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY STAGE
  //
  
  enyo.kind({
    name: "XV.OpportunityStagePicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.opportunityStages"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY TYPE
  //
  
  enyo.kind({
    name: "XV.OpportunityTypePicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.opportunityTypes"
    }
  });
  
  // ..........................................................
  // PRIORITY
  //
  
  enyo.kind({
    name: "XV.PriorityPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.priorities"
    }
  });
  
  // ..........................................................
  // PROJECT STATUS
  //
  
  enyo.kind({
    name: "XV.ProjectStatusPicker",
    kind: "XV.PickerWidget",
    published: {
      collection: "XM.projectStatuses",
      valueAttribute: "id"
    }
  });
  
}());
