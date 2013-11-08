/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  /**
   * Billing Module.
   */
  XT.extensions.billing.initPostbooks = function () {
    var module = {
        name: XT.extensions.billing.name,
        label: "_billing".loc(),
        panels: [
          {name: "customerList", kind: "XV.CustomerList"},
          {name: "invoiceList", kind: "XV.InvoiceList"},
          {name: "receivableList", kind: "XV.ReceivableList"}
        ]
      },
      relevantPrivileges = [
        "ApplyARMemos",
        "ConfigureAR",
        "DeleteItemMasters",
        "EditAROpenItem",
        "MaintainBankAccounts",
        "MaintainCustomerMasters",
        "MaintainCustomerGroups",
        "MaintainItemMasters",
        "MaintainMiscInvoices",
        "MaintainReasonCodes",
        "MaintainSalesCategories",
        "MaintainShipVias",
        "MaintainTerms",
        "OverrideTax",
        "PostMiscInvoices",
        "PrintInvoices",
        "ViewAROpenItems",
        "ViewCustomerMasters",
        "ViewCustomerGroups",
        "ViewItemMasters",
        "ViewMiscInvoices",
        "VoidPostedInvoices"
      ],
      configuration = {
        model: "XM.billing",
        name: "_billing".loc(),
        description: "_billingDescription".loc(),
        workspace: "XV.BillingWorkspace"
      },
      salesPanels = [
        {name: "sales_invoiceList", kind: "XV.InvoiceList"}
      ],
      setupPanels = [
        {name: "bankAccountList", kind: "XV.BankAccountList"},
        {name: "reasonCodeList", kind: "XV.ReasonCodeList"},
        {name: "salesCategoryList", kind: "XV.SalesCategoryList"},
        {name: "termsList", kind: "XV.TermsList"},
      ];

    XT.app.$.postbooks.appendPanels("setup", setupPanels);
    XT.app.$.postbooks.appendPanels("sales", salesPanels);

    XM.configurations.add(new XM.ConfigurationModel(configuration));
    XT.app.$.postbooks.insertModule(module, 0);
    XT.session.addRelevantPrivileges(XT.extensions.billing.name, relevantPrivileges);
  };

}());
