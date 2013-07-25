/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.inventory.initPostbooks = function () {
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
      {name: "itemSiteList", kind: "XV.ItemSiteList"},
      {name: "costCategoryList", kind: "XV.CostCategoryList"},
      {name: "plannerCodeList", kind: "XV.PlannerCodeList"},
      {name: "customerTypeList", kind: "XV.CustomerTypeList"},
      {name: "expenseCategoryList", kind: "XV.ExpenseCategoryList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);


    configurationJson = {
      model: "XM.Inventory",
      name: "_inventory".loc(),
      description: "_inventoryDescription".loc(),
      workspace: "XV.InventoryWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    module = {
      name: "inventory",
      label: "_inventory".loc(),
      panels: [
        {name: "shipmentList", kind: "XV.ShipmentList"},
        {name: "issueToShipping", kind: "XV.IssueToShippingList"},
        {name: "salesOrderLineListItem", kind: "XV.SalesOrderLineListItem"}
      ],
      actions: [
        {name: "issueToShipping", privilege: "issueStockToShipping", method: "issueToShipping", notify: false},
        {name: "returnCompleteShipment", privilege: "returnStockFromShipping", method: "returnCompleteShipment", notify: false}
      ],
      issueToShipping: function (inSender, inEvent) {
        inSender.bubbleUp("onIssueToShipping", inEvent, inSender);
      }

    };
    XT.app.$.postbooks.insertModule(module, 4);

    relevantPrivileges = ["MaintainCarriers", "ViewShipping", "ViewLocations", "ViewInventoryAvailability", "CreateAdjustmentTrans", "CreateScrapTrans", "CreateReceiptTrans", "CreateInterWarehouseTrans", "MaintainItemSites", "ViewItemSites", "PostCountSlips", "EnterCountSlips", "DeleteCountTags", "ZeroCountTags", "ViewCountTags", "PostCountTags", "PurgeCountSlips", "PurgeCountTags", "ViewInventoryValue", "RelocateInventory", "ReassignLotSerial", "ViewQOH", "UpdateCycleCountFreq", "UpdateLeadTime", "SummarizeInventoryTransactions", "ThawInventory", "MaintainCostCategories", "ViewCostCategories", "DeleteCountSlips", "PrintBillsOfLading", "ShipOrders", "ReturnStockFromShipping", "IssueStockToShipping", "PurgeShippingRecords", "ViewDestinations", "MaintainDestinations", "EnterShippingInformation", "RecallOrders", "ViewCarriers", "EnterReceipts", "EnterReturns", "UpdateOUTLevels", "UpdateReorderLevels", "MaintainPackingListBatch", "ViewPackingListBatch", "MaintainCharacteristics",
"ViewCharacteristics", "DeleteItemSites", "CreateExpenseTrans", "CreateTransformTrans", "RecallInvoicedShipment", "ViewItemAvailabilityWorkbench", "MaintainTransferOrders", "ViewTransferOrders", "OverrideTODate", "ViewInventoryHistory", "ViewWarehouses", "MaintainWarehouses", "UpdateABCClass", "FreezeInventory", "EnterMiscCounts", "IssueCountTags", "EnterCountTags", "MaintainLocations", "AlterTransactionDates", "MaintainExternalShipping", "MaintainSiteTypes", "ViewSiteTypes", "ReleaseTransferOrders"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    // Postbooks level handler for the thing that is neither fish nor fowl
    XT.app.$.postbooks.handlers.onIssueToShipping = "issueToShipping";
    XT.app.$.postbooks.issueToShipping = function (inSender, inEvent) {
      var panel = this.createComponent({kind: "XV.IssueToShipping"});

      panel.render();
      this.reflow();
      this.setIndex(this.getPanels().length - 1);

      return true;
    };

  };
}());
