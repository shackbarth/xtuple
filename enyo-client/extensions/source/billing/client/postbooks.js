/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  var billing = XT.extensions.billing;

  /**
   * Billing Module.
   */
  billing.initPostbooks = function () {
    var module = {
        name: billing.name,
        label: "_billing".loc(),
        panels: [
          {kind: "XV.CustomerList"}
        ]
      },
      relevantPrivileges = [
        "ConfigureAR",
        "DeleteItemMasters",
        "EditAROpenItem",
        "MaintainBankAccounts",
        "MaintainCustomerMasters",
        "MaintainCustomerGroups",
        "MaintainItemMasters",
        "MaintainReasonCodes",
        "MaintainSalesCategories",
        "MaintainShipVias",
        "MaintainTerms",
        "ViewAROpenItems",
        "ViewCustomerMasters",
        "ViewCustomerGroups",
        "ViewItemMasters"
      ],
      configuration = {
        model: "XM.billing",
        name: "_billing".loc(),
        description: "_billingDescription".loc(),
        workspace: "XV.BillingWorkspace"
      },
      setupPanels = [
        {name: "bankAccountList", kind: "XV.BankAccountList"},
        {name: "reasonCodeList", kind: "XV.ReasonCodeList"},
        {name: "salesCategoryList", kind: "XV.SalesCategoryList"},
        {name: "termsList", kind: "XV.TermsList"},
      ];

    XT.app.$.postbooks.appendPanels("setup", setupPanels);

    XM.configurations.add(new XM.ConfigurationModel(configuration));
    XT.app.$.postbooks.insertModule(module, 0);
    XT.session.addRelevantPrivileges(billing.name, relevantPrivileges);
  };

}());
