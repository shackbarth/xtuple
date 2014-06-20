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
        {name: "crmDashboard", kind: "XV.CrmDashboard"},
        {name: "accountList", kind: "XV.AccountList"},
        {name: "contactList", kind: "XV.ContactList"},
        {name: "crm_activityList", kind: "XV.ActivityList"},
        {name: "toDoList", kind: "XV.ToDoList"},
        {name: "opportunityList", kind: "XV.OpportunityList"},
        {name: "incidentList", kind: "XV.IncidentList", toggleSelected: false}
      ]
    };

    isBiAvailable = XT.session.config.biAvailable && XT.session.privileges.get("ViewSalesHistory");
    if (isBiAvailable) {
      module.panels.push({name: "analysisPage", kind: "analysisFrame"});
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

    /**
      This iFrame is to show the Analysis tool.
      On creation, it uses the analysis route to generate a signed,
      encoded JWT which it sends to Pentaho to get the report.
    */
    enyo.kind({
      name: "analysisFrame",
      label: "_analysis".loc(),
      tag: "iframe",
      style: "border: none;",
      attributes: {src: ""},
      events: {
        onMessage: ""
      },
      published: {
        source: ""
      },

      create: function () {
        this.inherited(arguments);
        if (XT.session.config.freeDemo) {
          this.doMessage({message: "_staleAnalysisWarning".loc()});
        }
        // generate the web token and render
        // the iFrame
        var url, ajax = new enyo.Ajax({
          url: XT.getOrganizationPath() + "/analysis",
          handleAs: "text"
        });
        ajax.response(this, function (inSender, inResponse) {
          this.setSource(inResponse);
        });
        // uh oh. HTTP error
        ajax.error(this, function (inSender, inResponse) {
          // TODO: trigger some kind of error here
          console.log("There was a problem generating the iFrame");
        });
        // param for the report name
        ajax.go({reportUrl: "content/saiku-ui/index.html?biplugin=true"});
      },
      /**
        When the published source value is set, this sets the src
        attribute on the iFrame.
      */
      sourceChanged: function () {
        this.inherited(arguments);
        this.setAttributes({src: this.getSource()});
      }
    });
  };
}());
