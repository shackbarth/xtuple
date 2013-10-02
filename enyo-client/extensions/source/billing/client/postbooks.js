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
        "ConfigureBilling",

        "CreateNewSalesCategory",
        "ViewSalesCategory",
        "MaintainSalesCategory",

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
        {kind: "XV.SalesCategoryList"}
      ];

    XM.configurations.add(new XM.ConfigurationModel(configuration));

    XT.app.$.postbooks.appendPanels("setup", setupPanels);
    XT.app.$.postbooks.insertModule(module, 0);
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);
  };

  }());
