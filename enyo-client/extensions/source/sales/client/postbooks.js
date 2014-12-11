/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, console:true, _:true */

(function () {

  XT.extensions.sales.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
      configurationJson,
      configuration,
      isBiAvailable;

    // ..........................................................
    // APPLICATION
    //

    panels = [
      {name: "bankAccountList", kind: "XV.BankAccountList"},
      {name: "customerEmailProfileList", kind: "XV.CustomerEmailProfileList"},
      {name: "siteList", kind: "XV.SiteList"},
      {name: "siteTypeList", kind: "XV.SiteTypeList"},
      {name: "saleTypeList", kind: "XV.SaleTypeList"},
      {name: "salesEmailProfileList", kind: "XV.SalesEmailProfileList"},
      {name: "shipViaList", kind: "XV.ShipViaList"},
      {name: "shipZoneList", kind: "XV.ShipZoneList"},
      {name: "salesRepList", kind: "XV.SalesRepList"},
      {name: "taxAssignmentList", kind: "XV.TaxAssignmentList"},
      {name: "taxAuthorityList", kind: "XV.TaxAuthorityList"},
      {name: "taxCodeList", kind: "XV.TaxCodeList"},
      {name: "taxClassList", kind: "XV.TaxClassList"},
      {name: "taxRateList", kind: "XV.TaxRateList"},
      {name: "taxTypeList", kind: "XV.TaxTypeList"},
      {name: "taxZoneList", kind: "XV.TaxZoneList"},
      {name: "termsList", kind: "XV.TermsList"},
      {name: "customerGroupList", kind: "XV.CustomerGroupList"},
      {name: "freightClassList", kind: "XV.FreightClassList"},
      {name: "itemList", kind: "XV.ItemList"},
      {name: "itemGroupList", kind: "XV.ItemGroupList"},
      {name: "itemSiteList", kind: "XV.ItemSiteList"},
      {name: "costCategoryList", kind: "XV.CostCategoryList"},
      {name: "plannerCodeList", kind: "XV.PlannerCodeList"},
      {name: "customerTypeList", kind: "XV.CustomerTypeList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);

    configurationJson = {
      model: "XM.sales",
      name: "_sales".loc(),
      description: "_salesDescription".loc(),
      workspace: "XV.SalesWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    module = {
      name: "sales",
      label: "_sales".loc(),
      panels: [
        {name: "customerList", kind: "XV.CustomerList"},
        {name: "prospectList", kind: "XV.ProspectList"},
        {name: "quoteList", kind: "XV.QuoteList"},
        {name: "salesOrderList", kind: "XV.SalesOrderList"},
        {name: "sales_activityList", kind: "XV.ActivityList"}
      ]
    };

    if (XT.session.settings.get("DashboardLite")) {
      var charts = [
        {name: "salesHistory", label: "_salesHistory".loc(), item: "XV.SalesHistoryTimeSeriesChart"},
        {name: "pastDueSalesOrders", label: "_pastDueSalesOrders".loc(), item: "XV.PastDueSalesOrderTimeSeriesChart"},
        {name: "salesOrder", label: "_salesOrders".loc(), item: "XV.SalesOrderTimeSeriesChart"}
      ];
      XT.app.$.postbooks.insertDashboardCharts(charts);
    }

    XT.app.$.postbooks.insertModule(module, 0);

    relevantPrivileges = [
      "AlterPackDate",
      "ConfigureSO",
      "ConfigureCC",
      "DeleteItemSites",
      "DeleteItemMasters",
      "MaintainBankAccounts",
      "MaintainCustomerGroups",
      "CreateSOForHoldCustomer",
      "CreateSOForWarnCustomer",
      "MaintainCostCategories",
      "MaintainCustomerEmailProfiles",
      "MaintainCustomerMasters",
      "MaintainCustomerTypes",
      "MaintainFreightClasses",
      "MaintainItemGroups",
      "MaintainItemMasters",
      "MaintainItemSites",
      "MaintainProspectMasters",
      "MaintainQuotes",
      "MaintainSalesEmailProfiles",
      "MaintainSalesOrders",
      "MaintainSalesReps",
      "MaintainShipVias",
      "MaintainShippingZones",
      "MaintainTaxAssignments",
      "MaintainTaxClasses",
      "MaintainTaxCodes",
      "MaintainTaxRates",
      "MaintainTaxReconciliations",
      "MaintainTaxRegistrations",
      "MaintainTaxTypes",
      "MaintainTaxZones",
      "MaintainTerms",
      "MaintainSaleTypes",
      "OverridePrice",
      "OverrideSODate",
      "OverrideTax",
      "ProcessCreditCards",
      "SelectBilling",
      "ShowMarginsOnSalesOrder",
      "UpdateCustomerCreditStatus",
      "ViewCosts",
      "ViewCustomerMasters",
      "ViewFreightClasses",
      "ViewCostCategories",
      "ViewCustomerGroups",
      "ViewCustomerTypes",
      "ViewItemMasters",
      "ViewItemSites",
      "ViewProspectMasters",
      "ViewQuotes",
      "ViewTaxAssignments",
      "ViewTaxClasses",
      "ViewTaxCodes",
      "ViewTaxRates",
      "ViewTaxReconciliations",
      "ViewTaxRegistrations",
      "ViewTaxTypes",
      "ViewTaxZones",
      "ViewSalesHistory",
      "ViewSalesOrders",
      "ViewSalesReps",
      "ViewSaleTypes",
      "ViewShipVias",
      "ViewShippingZones",
      "ViewTerms"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
