/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true */

(function () {

  XT.extensions.crm.initPostbooks = function () {
    var panels,
      module,
      relevantPrivileges,
      configurationJson,
      configuration,
      isBiAvailable;

    // ..........................................................
    // APPLICATION
    //

    configurationJson = {
      model: "XM.crm",
      name: "_crm".loc(),
      description: "_crmDescription".loc(),
      workspace: "XV.CrmWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    panels = [
      {name: "itemList", kind: "XV.ItemList"},
      {name: "itemGroupList", kind: "XV.ItemGroupList"},
      {name: "currencyList", kind: "XV.CurrencyList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"},
      {name: "priorityList", kind: "XV.PriorityList"},
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "incidentCategoryList", kind: "XV.IncidentCategoryList"},
      {name: "incidentResolutionList", kind: "XV.IncidentResolutionList"},
      {name: "incidentSeverityList", kind: "XV.IncidentSeverityList"},
      {name: "incidentEmailProfileList", kind: "XV.IncidentEmailProfileList"},
      {name: "opportunitySourceList", kind: "XV.OpportunitySourceList"},
      {name: "opportunityStageList", kind: "XV.OpportunityStageList"},
      {name: "opportunityTypeList", kind: "XV.OpportunityTypeList"},
      {name: "classCodeList", kind: "XV.ClassCodeList"},
      {name: "unitList", kind: "XV.UnitList"},
      {name: "productCategoryList", kind: "XV.ProductCategoryList"},
      {name: "characteristicList", kind: "XV.CharacteristicList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    module = {
      name: "crm",
      label: "_crm".loc(),
      panels: [
        {name: "accountList", kind: "XV.AccountList"},
        {name: "contactList", kind: "XV.ContactList"},
        {name: "crm_activityList", kind: "XV.ActivityList"},
        {name: "toDoList", kind: "XV.ToDoList"},
        {name: "opportunityList", kind: "XV.OpportunityList"},
        {name: "incidentList", kind: "XV.IncidentList", toggleSelected: false}
      ]
    };

    if (XT.session.settings.get("DashboardLite")) {
      var dashboardModule = {
        name: "dashboardLite",
        label: "_dashboard".loc(),
        panels: [
          {
            name: "dashboardLite",
            kind: "XV.DashboardLite",
            newActions: [
              {name: "assignedIncidents", label: "_assignedIncidents".loc(), item: "XV.AssignedIncidentBarChart"},
              {name: "opportunities", label: "_opportunities".loc(), item: "XV.OpportunityBarChart"}
            ]
          }
        ]
      };

      XT.app.$.postbooks.insertModule(dashboardModule, 0);
    }

    XT.app.$.postbooks.insertModule(module, 0);

    relevantPrivileges = [
      "CreateNewCurrency",
      "MaintainCurrencies",
      "MaintainCurrencyRates",
      "ViewCurrencyRates",
      "EditOwner",
      "MaintainAddresses",
      "MaintainAllContacts",
      "MaintainAllCRMAccounts",
      "MaintainAllIncidents",
      "MaintainAllOpportunities",
      "MaintainAllToDoItems",
      "MaintainCharacteristics",
      "MaintainIncidentCategories",
      "MaintainIncidentPriorities",
      "MaintainIncidentResolutions",
      "MaintainIncidentSeverities",
      "MaintainItemGroups",
      "MaintainOpportunitySources",
      "MaintainOpportunityStages",
      "MaintainOpportunityTypes",
      "MaintainPersonalContacts",
      "MaintainPersonalCRMAccounts",
      "MaintainPersonalIncidents",
      "MaintainPersonalOpportunities",
      "MaintainPersonalProjects",
      "MaintainPersonalToDoItems",
      "MaintainTitles",
      "ReassignToDoItems",
      "ViewAddresses",
      "ViewAllContacts",
      "ViewAllCRMAccounts",
      "ViewAllIncidentHistory",
      "ViewAllIncidents",
      "ViewAllOpportunities",
      "ViewAllProjects",
      "ViewAllToDoItems",
      "ViewCharacteristics",
      "ViewPersonalContacts",
      "ViewPersonalCRMAccounts",
      "ViewPersonalIncidents",
      "ViewPersonalOpportunities",
      "ViewPersonalToDoItems",
      "ViewTitles",
      "DeleteItemMasters",
      "MaintainClassCodes",
      "MaintainItemMasters",
      "MaintainProductCategories",
      "MaintainUOMs",
      "ViewClassCodes",
      "ViewItemMasters",
      "ViewProductCategories",
      "ConfigureCRM",
      "EditOthersComments",
      "EditOwnComments",
      "MaintainCommentTypes",
      "MaintainCountries",
      "MaintainStates",
      "ViewEmailProfiles",
      "MaintainEmailProfiles"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
