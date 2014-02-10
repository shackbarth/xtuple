/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i,
    K;

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
  var configurationJson = [
    {
      model: "XM.databaseInformation",
      name: "_database".loc(),
      description: "_databaseInformation".loc(),
      workspace: "XV.DatabaseInformationWorkspace"
    },
    {
      model: "XM.system",
      name: "_system".loc(),
      description: "_systemConfiguration".loc(),
      workspace: "XV.SystemConfigurationWorkspace"
    }
  ];
  XM.ConfigurationModel = Backbone.Model.extend({
    attributeId: 'model'
  });
  XM.ConfigurationCollection = Backbone.Collection.extend({
    model: XM.AccountTypeModel
  });
  XM.configurations = new XM.ConfigurationCollection();
  _.each(configurationJson, function (config) {
    var configuration = new XM.ConfigurationModel(config);
    XM.configurations.add(configuration);
  });

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

  // Credit Card Gateways
  XM.CreditCardGatewayModel = Backbone.Model.extend({
    getValue: function (key) {
      return this.get(key);
    }
  });
  XM.CreditCardGatewayCollection = Backbone.Collection.extend({
    model: XM.CreditCardGatewayModel
  });
  XM.creditCardGateways = new XM.CreditCardGatewayCollection();
  // new and better way
  _.each([
      { id: "Authorize.Net", name: "Authorize.Net" },
      { id: "External", name: "External" }
    ], function (attrs) {
      XM.creditCardGateways.add(new XM.CreditCardGatewayModel(attrs));
    }
  );

  // Credit Card Type
  var creditCardTypeJson = [
    { id: "A", name: "_amEx".loc() },
    { id: "D", name: "_discover".loc() },
    { id: "M", name: "_masterCard".loc() },
    { id: "V", name: "_visa".loc() }
  ];
  XM.CreditCardTypeModel = Backbone.Model.extend({
  });
  XM.CreditCardTypeCollection = Backbone.Collection.extend({
    model: XM.CreditCardTypeModel
  });
  XM.creditCardTypes = new XM.CreditCardTypeCollection();
  for (i = 0; i < creditCardTypeJson.length; i++) {
    var creditCardType = new XM.CreditCardTypeModel(creditCardTypeJson[i]);
    XM.creditCardTypes.add(creditCardType);
  }

  // Credit Status
  K = XM.Customer;
  var creditStatusJson = [
    { id: K.CREDIT_GOOD, name: "_goodStanding".loc() },
    { id: K.CREDIT_WARN, name: "_creditWarning".loc() },
    { id: K.CREDIT_HOLD, name: "_creditHolding".loc() }
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
  K = XM.Incident;
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

  // Month (for credit cards)
  XM.MonthModel = Backbone.Model.extend({
  });
  XM.MonthCollection = Backbone.Collection.extend({
    model: XM.MonthModel
  });
  XM.months = new XM.MonthCollection();
  for (i = 1; i <= 12; i++) {
    var monthFormat = i < 10 ? "0" + i : "" + i;
    var month = new XM.MonthModel({id: monthFormat, name: monthFormat});
    XM.months.add(month);
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
  K = XM.SalesOrder;
  var holdTypeJson = [
    { id: K.CREDIT_HOLD_TYPE, name: "_credit".loc() },
    { id: K.SHIPPING_HOLD_TYPE, name: "_shipping".loc() },
    { id: K.PACKING_HOLD_TYPE, name: "_packing".loc() },
    { id: K.RETURN_HOLD_TYPE, name: "_return".loc() }
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

  // Year (for credit cards)
  XM.YearModel = Backbone.Model.extend({
  });
  XM.YearCollection = Backbone.Collection.extend({
    model: XM.YearModel
  });
  XM.years = new XM.YearCollection();
  for (i = 2000; i <= 2030; i++) {
    var yearFormat = "" + i;
    var year = new XM.YearModel({id: yearFormat, name: yearFormat});
    XM.years.add(year);
  }

  // Sort Type
  var sortTypeJson = [
    { id: "ascending", name: "_ascending".loc() },
    { id: "descending", name: "_descending".loc() }
  ];
  XM.SortTypeModel = Backbone.Model.extend({
  });
  XM.SortTypeCollection = Backbone.Collection.extend({
    model: XM.SortTypeModel
  });
  XM.sortTypes = new XM.SortTypeCollection();
  for (i = 0; i < sortTypeJson.length; i++) {
    var sortType = new XM.SortTypeModel(sortTypeJson[i]);
    XM.sortTypes.add(sortType);
  }

  // Attributes for Sorting and Column Layout
  XM.Attribute = Backbone.Model.extend({});
  XM.AttributeCollection = Backbone.Collection.extend({
    model: XM.Attribute
  });

  // Reason Code Document Types
  K = XM.ReasonCode;
  var reasonDocTypeJson = [
    { id: K.DEBIT_MEMO, name: "_debitMemo".loc() },
    { id: K.CREDIT_MEMO, name: "_creditMemo".loc() }
  ];
  XM.ReasonDocTypeModel = Backbone.Model.extend({});
  XM.ReasonDocTypeCollection = Backbone.Collection.extend({
    model: XM.ReasonDocTypeModel
  });
  XM.reasonCodeDocumentTypes = new XM.ReasonDocTypeCollection();
  for (i = 0; i < reasonDocTypeJson.length; i++) {
    var reasonDocType = new XM.ReasonDocTypeModel(reasonDocTypeJson[i]);
    XM.reasonCodeDocumentTypes.add(reasonDocType);
  }

  // Bank Account Types
  K = XM.BankAccount;
  var bankAccountTypeJson = [
    { id: K.CASH, name: "_cash".loc() },
    { id: K.CHECKING, name: "_checking".loc() },
    { id: K.CREDIT_CARD, name: "_creditCard".loc() }
  ];
  XM.BankAccountTypeModel = Backbone.Model.extend({});
  XM.BankAccountTypeCollection = Backbone.Collection.extend({
    model: XM.BankAccountTypeModel
  });
  XM.bankAccountTypes = new XM.BankAccountTypeCollection();
  for (i = 0; i < bankAccountTypeJson.length; i++) {
    var bankAccountType = new XM.BankAccountTypeModel(bankAccountTypeJson[i]);
    XM.bankAccountTypes.add(bankAccountType);
  }

  // Workflow Status
  K = XM.Workflow;
  var workflowStatusJson = [
    { id: K.PENDING, name: "_pending".loc() },
    { id: K.IN_PROCESS, name: "_inProcess".loc() },
    { id: K.COMPLETED, name: "_completed".loc() },
    { id: K.DEFERRED, name: "_deferred".loc() },
  ];
  XM.WorkflowStatusModel = Backbone.Model.extend({});
  XM.WorkflowStatusCollection = Backbone.Collection.extend({
    model: XM.WorkflowStatusModel
  });
  XM.workflowStatuses = new XM.WorkflowStatusCollection();
  for (i = 0; i < workflowStatusJson.length; i++) {
    var workflowStatus = new XM.WorkflowStatusModel(workflowStatusJson[i]);
    XM.workflowStatuses.add(workflowStatus);
  }

  // Workflow Type
  var salesOrderWorkflowTypeJson = [
    { id: XM.SalesOrderWorkflow.TYPE_OTHER, name: "_other".loc() },
    { id: XM.SalesOrderWorkflow.TYPE_CREDIT_CHECK, name: "_creditCheck".loc() }//,
  ];
  XM.SalesOrderWorkflowTypeModel = Backbone.Model.extend({});
  XM.SalesOrderWorkflowTypeCollection = Backbone.Collection.extend({
    model: XM.SalesOrderWorkflowTypeModel
  });
  XM.salesOrderWorkflowTypes = new XM.SalesOrderWorkflowTypeCollection();
  _.each(salesOrderWorkflowTypeJson, function (obj) {
    XM.salesOrderWorkflowTypes.add(new XM.SalesOrderWorkflowTypeModel(obj));
  });

  // Project Status
  K = XM.ProjectStatusMixin;
  var projectStatusJson = [
    { id: K.CONCEPT, name: "_concept".loc() },
    { id: K.REVIEW, name: "_review".loc() },
    { id: K.REVISION, name: "_revision".loc() },
    { id: K.APPROVED, name: "_approved".loc() },
    { id: K.IN_PROCESS, name: "_inProcess".loc() },
    { id: K.COMPLETED, name: "_completed".loc() },
    { id: K.REJECTED, name: "_rejected".loc() }
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

  // Sales Order
  K = XM.SalesOrder;
  var salesOrderStatusesJson = [
    { id: K.OPEN_STATUS, name: "_open".loc() },
    { id: K.CLOSED_STATUS, name: "_closed".loc() },
    { id: K.CANCELLED_STATUS, name: "_cancelled".loc() }
  ];
  XM.SalesOrderStatusModel = Backbone.Model.extend({
  });
  XM.SalesOrderStatusCollection = Backbone.Collection.extend({
    model: XM.SalesOrderStatusModel
  });
  XM.salesOrderStatuses = new XM.SalesOrderStatusCollection();
  for (i = 0; i < salesOrderStatusesJson.length; i++) {
    var SalesOrderStatus = new XM.SalesOrderStatusModel(salesOrderStatusesJson[i]);
    XM.salesOrderStatuses.add(SalesOrderStatus);
  }

}());
