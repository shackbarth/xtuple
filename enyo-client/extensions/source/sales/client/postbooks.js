/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.sales.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
      configurationJson,
      configuration;

    // ..........................................................
    // APPLICATION
    //

    panels = [
      {name: "siteList", kind: "XV.SiteList"},
      {name: "siteTypeList", kind: "XV.SiteTypeList"},
      {name: "saleTypeList", kind: "XV.SaleTypeList"},
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
        {name: "salesAnalysisPage", kind: "analysisFrame"}
      ]
    };

    /**
      This iFrame is to show the Sales Analysis report from Pentaho.
      On creation, it uses the analysis route to generate a signed,
      encoded JWT which it sends to Pentaho to get the report.
    */
    enyo.kind({
      name: "analysisFrame",
      label: "_analysis".loc(),
      tag: "iframe",
      style: "border: none;",
      attributes: {src: ""},
      published: {
        source: ""
      },

      create: function () {
        this.inherited(arguments);
        // generate the web tooken and render
        // the iFrame
        var url, ajax = new enyo.Ajax({
          url: XT.getOrganizationPath() + "/analysis",
          contentType: "application/json"
        });
        ajax.response(this, function (inSender, inResponse) {
          this.setSource(inResponse);
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

    XT.app.$.postbooks.insertModule(module, 2);

    relevantPrivileges = [
      "ConfigureSO",
      "MaintainFreightClasses",
      "MaintainCustomerGroups",
      "MaintainQuotes",
      "MaintainSalesOrders",
      "MaintainSalesReps",
      "MaintainShipZones",
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
      "OverrideTax",
      "ShowMarginsOnSalesOrder",
      "ViewFreightClasses",
      "ViewCustomerGroups",
      "ViewQuotes",
      "ViewTaxAssignments",
      "ViewTaxClasses",
      "ViewTaxCodes",
      "ViewTaxRates",
      "ViewTaxReconciliations",
      "ViewTaxRegistrations",
      "ViewTaxTypes",
      "ViewTaxZones",
      "ViewSalesOrders",
      "ViewSalesReps",
      "ViewSaleTypes",
      "ViewShipZones",
      "ViewTerms"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };
}());
