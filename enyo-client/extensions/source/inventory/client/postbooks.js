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
      model: "XM.inventory",
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
        {name: "salesOrderLineListItem", kind: "XV.SalesOrderLineListItem"}
      ],
      actions: [
        {name: "issueToShipping", privilege: "issueStockToShipping", method: "issueToShipping", notify: false}
      ],
      issueToShipping: function (inSender, inEvent) {
        inSender.bubbleUp("onIssueToShipping", inEvent, inSender);
      }

    };
    XT.app.$.postbooks.insertModule(module, 4);

    relevantPrivileges = [
      "ConfigureIM"
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
