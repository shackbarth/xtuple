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
        // XM.Billing
        "ConfigureAR",

        // XM.SalesCategory
        "MaintainSalesCategories",

        // Customer
        "MaintainCustomerMasters",
        "MaintainCustomerGroups",
        "ViewCustomerMasters",
        "ViewCustomerGroups"
      ],
      configuration = {
        model: "XM.billing",
        name: "_billing".loc(),
        description: "_billingDescription".loc(),
        workspace: "XV.BillingWorkspace"
      },
      setupPanels = [
        {name: "salesCategoryList", kind: "XV.SalesCategoryList"}
      ];

    console.log("adding billing setupPanels...");
    XT.app.$.postbooks.appendPanels("setup", setupPanels);

    // TODO
    XM.configurations.add(new XM.ConfigurationModel(configuration));

    console.log("billing.name: " + billing.name);

    XT.app.$.postbooks.insertModule(module, 0);
    XT.session.addRelevantPrivileges(billing.name, relevantPrivileges);
  };

}());
