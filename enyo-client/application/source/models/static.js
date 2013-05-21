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

  // Balance Methods
  var balanceMethodJson = [
    { id: "B", name: "_balanceForward".loc() },
    { id: "O", name: "_openItems".loc() }
  ];
  XM.BalanceMethodModel = Backbone.Model.extend({
  });
  XM.BalanceMethodCollection = Backbone.Collection.extend({
    model: XM.BalanceMethodModel
  });
  XM.balanceMethods = new XM.BalanceMethodCollection();
  for (i = 0; i < balanceMethodJson.length; i++) {
    var balanceMethod = new XM.BalanceMethodModel(balanceMethodJson[i]);
    XM.balanceMethods.add(balanceMethod);
  }

  // Credit Status
  var creditStatusJson = [
    { id: "G", name: "_goodStanding".loc() },
    { id: "W", name: "_creditWarning".loc() },
    { id: "H", name: "_creditHolding".loc() }
  ];
  XM.CreditStatusModel = Backbone.Model.extend({
  });
  XM.CreditStatusCollection = Backbone.Collection.extend({
    model: XM.CreditStatusModel
  });
  XM.creditStatuses = new XM.CreditStatusCollection();
  for (i = 0; i < creditStatusJson.length; i++) {
    var creditStatus = new XM.CreditStatusModel(creditStatusJson[i]);
    XM.creditStatuses.add(creditStatus);
  }

  // Incident Status (TODO: There is actually already a table for this one...)
  var K = XM.Incident;
  var incidentStatusJson = [
    { id: K.NEW, name: "_new".loc() },
    { id: K.FEEDBACK, name: "_feedback".loc() },
    { id: K.CONFIRMED, name: "_confirmed".loc() },
    { id: K.ASSIGNED, name: "_assigned".loc() },
    { id: K.RESOLVED, name: "_resolved".loc() },
    { id: K.CLOSED, name: "_closed".loc() }
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

  // Item type
  K = XM.Item;
  var itemTypeJson = [
    { id: K.PURCHASED, name: "_purchased".loc() },
    { id: K.MANUFACTURED, name: "_manufactured".loc() },
    { id: K.PHANTOM, name: "_phantom".loc() },
    { id: K.REFERENCE, name: "_reference".loc() },
    { id: K.COSTING, name: "_costing".loc() },
    { id: K.TOOLING, name: "_tooling".loc() },
    { id: K.OUTSIDE_PROCESS, name: "_outsideProcess".loc() },
    { id: K.PLANNING, name: "_planning".loc() },
    { id: K.KIT, name: "_kit".loc() },
    { id: K.BREEDER, name: "_breeder".loc() },
    { id: K.CO_PRODUCT, name: "_coProduct".loc() },
    { id: K.BY_PRODUCT, name: "_byProduct".loc() }
  ];
  XM.ItemTypeModel = Backbone.Model.extend();
  XM.ItemTypeCollection = Backbone.Collection.extend({
    model: XM.ItemTypeModel
  });
  XM.itemTypes = new XM.ItemTypeCollection();
  for (i = 0; i < itemTypeJson.length; i++) {
    var itemType = new XM.ItemTypeModel(itemTypeJson[i]);
    XM.itemTypes.add(itemType);
  }

  // Ledger Account Type
  K = XM.LedgerAccount;
  var ledgerAccountTypeJson = [
    { id: K.ASSET, name: "_asset".loc() },
    { id: K.LIABILITY, name: "_liability".loc() },
    { id: K.REVENUE, name: "_revenue".loc() },
    { id: K.EXPENSE, name: "_expense".loc() },
    { id: K.EQUITY, name: "_equity".loc() }
  ];
  XM.LedgerAccountTypeModel = Backbone.Model.extend({
  });
  XM.LedgerAccountTypeCollection = Backbone.Collection.extend({
    model: XM.LedgerAccountTypeModel
  });
  XM.ledgerAccountTypes = new XM.LedgerAccountTypeCollection();
  for (i = 0; i < ledgerAccountTypeJson.length; i++) {
    var ledgerAccountType = new XM.LedgerAccountTypeModel(accountTypeJson[i]);
    XM.ledgerAccountTypes.add(ledgerAccountType);
  }

  // Number Policy
  K = XM.Document;
  var numberPolicyJson = [
    { id: K.MANUAL_NUMBER, name: "_manual".loc() },
    { id: K.AUTO_NUMBER, name: "_automatic".loc() },
    { id: K.AUTO_OVERRIDE_NUMBER, name: "_automaticOverride".loc() }
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
  K = XM.Project;
  var projectStatusJson = [
    { id: K.CONCEPT, name: "_concept".loc() },
    { id: K.IN_PROCESS, name: "_inProcess".loc() },
    { id: K.COMPLETED, name: "_completed".loc() }
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

  // Characteristic Type
  K = XM.Characteristic;
  var characteristicTypeJson = [
    { id: K.TEXT, name: "_text".loc() },
    { id: K.LIST, name: "_list".loc() },
    { id: K.DATE, name: "_date".loc() }
  ];
  XM.CharacteristicTypeModel = Backbone.Model.extend({
  });
  XM.CharacteristicTypeCollection = Backbone.Collection.extend({
    model: XM.CharacteristicTypeModel
  });
  XM.characteristicTypes = new XM.CharacteristicTypeCollection();
  for (i = 0; i < characteristicTypeJson.length; i++) {
    var characteristicType = new XM.CharacteristicTypeModel(characteristicTypeJson[i]);
    XM.characteristicTypes.add(characteristicType);
  }

  // Terms Type
  var termsTypeJson = [
    { id: "D", name: "_days".loc() },
    { id: "P", name: "_proximo".loc() }
  ];
  XM.TermsTypeModel = Backbone.Model.extend({
  });
  XM.TermsTypeCollection = Backbone.Collection.extend({
    model: XM.TermsTypeModel
  });
  XM.termsTypes = new XM.TermsTypeCollection();
  for (i = 0; i < termsTypeJson.length; i++) {
    var termsType = new XM.TermsTypeModel(termsTypeJson[i]);
    XM.termsTypes.add(termsType);
  }

  // Hold Type
  var holdTypeJson = [
    { id: "C", name: "_credit".loc() },
    { id: "S", name: "_shipping".loc() },
    { id: "P", name: "_packing".loc() },
    { id: "R", name: "_return".loc() }
  ];
  XM.HoldTypeModel = Backbone.Model.extend({
  });
  XM.HoldTypeCollection = Backbone.Collection.extend({
    model: XM.HoldTypeModel
  });
  XM.holdTypes = new XM.HoldTypeCollection();
  for (i = 0; i < holdTypeJson.length; i++) {
    var holdType = new XM.HoldTypeModel(holdTypeJson[i]);
    XM.holdTypes.add(holdType);
  }
  
  // Wage types
  K = XM.Wage;
  var wageTypeJson = [
    { id: K.HOURLY, name: "_hourly".loc() },
    { id: K.SALARIED, name: "_salaried".loc() }
  ];
  XM.WageTypeModel = Backbone.Model.extend();
  XM.WageTypeCollection = Backbone.Collection.extend({
    model: XM.WageTypeModel
  });
  XM.wageTypes = new XM.WageTypeCollection();
  for (i = 0; i < wageTypeJson.length; i++) {
    var wageType = new XM.WageTypeModel(wageTypeJson[i]);
    XM.wageTypes.add(wageType);
  }
  
  // Wage periods
  var wagePeriodJson = [
    { id: K.HOURLY, name: "_hourly".loc() },
    { id: K.DAILY, name: "_daily".loc() },
    { id: K.WEEKLY, name: "_weekly".loc() },
    { id: K.BI_WEEKLY, name: "_biWeekly".loc() },
    { id: K.MONTHLY, name: "_monthly".loc() },
    { id: K.ANNULY, name: "_annualy".loc() }
  ];
  XM.WagePeriodModel = Backbone.Model.extend();
  XM.WagePeriodCollection = Backbone.Collection.extend({
    model: XM.WagePeriodModel
  });
  XM.wagePeriods = new XM.WagePeriodCollection();
  for (i = 0; i < wagePeriodJson.length; i++) {
    var wagePeriod = new XM.WagePeriodModel(wagePeriodJson[i]);
    XM.wagePeriods.add(wagePeriod);
  }
  
  // ToDo Status
  K = XM.ToDo;
  var toDoStatusJson = [
    { id: K.PENDING, name: "_pending".loc() },
    { id: K.DEFERRED, name: "_deferred".loc() },
    { id: K.NEITHER, name: "_neither".loc() }
  ];
  XM.ToDoStatusModel = Backbone.Model.extend({
  });
  XM.ToDoStatusCollection = Backbone.Collection.extend({
    model: XM.ToDoStatusModel
  });
  XM.toDoStatuses = new XM.ToDoStatusCollection();
  for (i = 0; i < toDoStatusJson.length; i++) {
    var toDoStatus = new XM.ToDoStatusModel(toDoStatusJson[i]);
    XM.toDoStatuses.add(toDoStatus);
  }

}());
