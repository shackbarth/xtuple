/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.purchasing.initPostbooks = function () {
    var module, panels, relevantPrivileges;

    // ..........................................................
    // APPLICATION
    //
    panels = [
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "expenseCategoryList", kind: "XV.ExpenseCategoryList"},
      {name: "itemList", kind: "XV.ItemList"},
      {name: "itemGroupList", kind: "XV.ItemGroupList"},
      {name: "classCodeList", kind: "XV.ClassCodeList"},
      {name: "unitList", kind: "XV.UnitList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"},
      {name: "purchaseEmailProfileList", kind: "XV.PurchaseEmailProfileList"},
      {name: "purchaseTypeList", kind: "XV.PurchaseTypeList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    module = {
      name: "purchasing",
      label: "_purchasing".loc(),
      panels: [
        {name: "ItemSourceList", kind: "XV.ItemSourceList"},
        {name: "purchaseOrderList", kind: "XV.PurchaseOrderList"},
        {name: "purchasing_activityList", kind: "XV.ActivityList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 0);

    relevantPrivileges = [
      "EditOthersComments",
      "EditOwnComments",
      "DeleteItemMasters",
      "MaintainAddresses",
      "MaintainCommentTypes",
      "MaintainCountries",
      "MaintainClassCodes",
      "MaintainExpenseCategories",
      "MaintainTitles",
      "MaintainItemGroups",
      "MaintainItemMasters",
      "MaintainPurchaseEmailProfiles",
      "MaintainPurchaseTypes",
      "MaintainPurchaseOrders",
      "MaintainStates",
      "MaintainUOMs",
      "ViewClassCodes",
      "ViewItemMasters",
      "ViewPurchaseOrders",
      "ViewTitles",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    XM.configurations.add(new XM.ConfigurationModel({
      model: "XM.purchasing",
      name: "_purchasing".loc(),
      description: "_purchasing".loc(),
      workspace: "XV.PurchasingWorkspace"
    }));

  };
}());
