/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i;

  // Account Type
  var accountTypeJson = [
    { id: "O", name: "_organization".loc() },
    { id: "I", name: "_individual".loc() }
  ];
  XM.AccountTypeModel = Backbone.Model.extend({
  });
  XM.AccountTypeCollection = Backbone.Collection.extend({
    model: XM.AccountTypeModel
  });
  XM.accountTypes = new XM.AccountTypeCollection();
  for (i = 0; i < accountTypeJson.length; i++) {
    var accountType = new XM.AccountTypeModel(accountTypeJson[i]);
    XM.accountTypes.add(accountType);
  }
  
  // Configuration
  var configurationJson = {
    model: "XM.databaseInformation",
    name: "_database".loc(),
    description: "_database".loc() + " " + "_information".loc(),
    workspace: "XV.DatabaseInformationWorkspace"
  };
  XM.ConfigurationModel = Backbone.Model.extend({
    attributeId: 'model'
  });
  XM.ConfigurationCollection = Backbone.Collection.extend({
    model: XM.AccountTypeModel
  });
  XM.configurations = new XM.ConfigurationCollection();
  var configuration = new XM.ConfigurationModel(configurationJson);
  XM.configurations.add(configuration);
  
  // Incident Status (TODO: There is actually already a table for this one...)
  var incidentStatusJson = [
    { id: "N", name: "_new".loc() },
    { id: "F", name: "_feedback".loc() },
    { id: "C", name: "_confirmed".loc() },
    { id: "A", name: "_assigned".loc() },
    { id: "R", name: "_resolved".loc() },
    { id: "L", name: "_closed".loc() }
  ];
  XM.IncidentStatusModel = Backbone.Model.extend();
  XM.IncidentStatusCollection = Backbone.Collection.extend({
    model: XM.IncidentStatusModel
  });
  XM.incidentStatuses = new XM.IncidentStatusCollection();
  for (i = 0; i < incidentStatusJson.length; i++) {
    var incidentStatus = new XM.IncidentStatusModel(incidentStatusJson[i]);
    XM.incidentStatuses.add(incidentStatus);
  }
  
  // Number Policy
  var numberPolicyJson = [
    { id: "M", name: "_manual".loc() },
    { id: "A", name: "_automatic".loc() },
    { id: "O", name: "_automaticOverride".loc() }
  ];
  XM.NumberPolicyModel = Backbone.Model.extend({
  });
  XM.NumberPolicyCollection = Backbone.Collection.extend({
    model: XM.NumberPolicyModel
  });
  XM.numberPolicies = new XM.NumberPolicyCollection();
  for (i = 0; i < numberPolicyJson.length; i++) {
    var numberPolicy = new XM.NumberPolicyModel(numberPolicyJson[i]);
    XM.numberPolicies.add(numberPolicy);
  }
  
  // Project Status
  var projectStatusJson = [
    { id: "P", name: "_concept".loc() },
    { id: "O", name: "_inProcess".loc() },
    { id: "C", name: "_completed".loc() }
  ];
  XM.ProjectStatusModel = Backbone.Model.extend({
  });
  XM.ProjectStatusCollection = Backbone.Collection.extend({
    model: XM.ProjectStatusModel
  });
  XM.projectStatuses = new XM.ProjectStatusCollection();
  for (i = 0; i < projectStatusJson.length; i++) {
    var projectStatus = new XM.ProjectStatusModel(projectStatusJson[i]);
    XM.projectStatuses.add(projectStatus);
  }

}());
