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
    collection: "XM.accountTypes",
    valueAttribute: "id"
  });

  // ..........................................................
  // CLASS CODE
  //

  enyo.kind({
    name: "XV.ClassCodeWidget",
    kind: "XV.PickerWidget",
    collection: "XM.classCodes",
    nameAttribute: "code"
  });

  // ..........................................................
  // COMMENT TYPE
  //

  enyo.kind({
    name: "XV.CommentTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.commentTypes"
  });

  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.CountryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.countries"
  });

  // ..........................................................
  // INCIDENT CATEGORY
  //

  enyo.kind({
    name: "XV.IncidentCategoryPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentCategories"
  });

  // ..........................................................
  // INCIDENT RESOLUTION
  //

  enyo.kind({
    name: "XV.IncidentResolutionPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentResolutions"
  });

  // ..........................................................
  // INCIDENT SEVERITY
  //

  enyo.kind({
    name: "XV.IncidentSeverityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentSeverities"
  });

  // ..........................................................
  // INCIDENT STATUS
  //

  enyo.kind({
    name: "XV.IncidentStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.incidentStatuses",
    valueAttribute: "id"
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //

  enyo.kind({
    name: "XV.OpportunitySourcePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunitySources"
  });

  // ..........................................................
  // OPPORTUNITY STAGE
  //

  enyo.kind({
    name: "XV.OpportunityStagePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunityStages"
  });

  // ..........................................................
  // OPPORTUNITY TYPE
  //

  enyo.kind({
    name: "XV.OpportunityTypePicker",
    kind: "XV.PickerWidget",
    collection: "XM.opportunityTypes"
  });

  // ..........................................................
  // PRIORITY
  //

  enyo.kind({
    name: "XV.PriorityPicker",
    kind: "XV.PickerWidget",
    collection: "XM.priorities"
  });

  // ..........................................................
  // PRODUCT CATEGORY
  //

  enyo.kind({
    name: "XV.ProductCategoryWidget",
    kind: "XV.PickerWidget",
    collection: "XM.productCategories",
    nameAttribute: "code"
  });

  // ..........................................................
  // PROJECT STATUS
  //

  enyo.kind({
    name: "XV.ProjectStatusPicker",
    kind: "XV.PickerWidget",
    collection: "XM.projectStatuses",
    valueAttribute: "id"
  });

  // ..........................................................
  // UNIT
  //

  enyo.kind({
    name: "XV.UnitWidget",
    kind: "XV.PickerWidget",
    collection: "XM.units",
    nameAttribute: "description" // XXX this could be the default, "name"
  });
}());
