(function () {

  /**
   * Billing Module.
   */
  XT.extensions.billing.initPostbooks = function () {
    var module = {
        name: XT.extensions.billing.name,
        label: "_billing".loc(),
        panels: [
          {name: "billing_customerList", kind: "XV.CustomerList"},
          {name: "invoiceList", kind: "XV.InvoiceList"},
          {name: "returnList", kind: "XV.ReturnList"},
          {name: "receivableList", kind: "XV.ReceivableList"}//,
          //{name: "cashReceiptList", kind: "XV.CashReceiptList"}
        ]
      },
      relevantPrivileges = [
        "ApplyARMemos",
        "ConfigureAR",
        "CreateNewCurrency",
        "DeleteItemMasters",
        "EditAROpenItem",
        "MaintainBankAccounts",
        "MaintainCashReceipts",
        "MaintainCreditMemos",
        "MaintainCurrencies",
        "MaintainCustomerEmailProfiles",
        "MaintainCustomerMasters",
        "MaintainCustomerGroups",
        "MaintainIncidentCategories",
        "MaintainItemMasters",
        "MaintainItemGroups",
        "MaintainMiscInvoices",
        "MaintainReasonCodes",
        "MaintainSalesCategories",
        "MaintainShipVias",
        "MaintainTerms",
        "OverrideTax",
        "PostARDocuments",
        "PostCashReceipts",
        "PostMiscInvoices",
        "PrintCreditMemos",
        "PrintInvoices",
        "ViewAROpenItems",
        "ViewCashReceipts",
        "ViewCreditMemos",
        "ViewCustomerMasters",
        "ViewCustomerGroups",
        "ViewItemMasters",
        "ViewMiscInvoices",
        "ViewSalesCategories",
        "ViewShipVias",
        "VoidPostedARCreditMemos",
        "VoidPostedCashReceipts",
        "VoidPostedInvoices"
      ],
      configuration = {
        model: "XM.billing",
        name: "_billing".loc(),
        description: "_billingDescription".loc(),
        workspace: "XV.BillingWorkspace"
      },
      salesPanels,
      setupPanels = [
        {name: "bankAccountList", kind: "XV.BankAccountList"},
        {name: "customerEmailProfileList", kind: "XV.CustomerEmailProfileList"},
        {name: "fileList", kind: "XV.FileList"},
        {name: "itemList", kind: "XV.ItemList"},
        {name: "itemGroupList", kind: "XV.ItemGroupList"},
        {name: "reasonCodeList", kind: "XV.ReasonCodeList"},
        {name: "salesCategoryList", kind: "XV.SalesCategoryList"},
        {name: "termsList", kind: "XV.TermsList"}
      ];

    XT.app.$.postbooks.appendPanels("setup", setupPanels);
    if (XT.extensions.sales) {
      salesPanels = [
        {name: "sales_invoiceList", kind: "XV.InvoiceList"}
      ];
      XT.app.$.postbooks.appendPanels("sales", salesPanels);
    }

    XM.configurations.add(new XM.ConfigurationModel(configuration));
    XT.app.$.postbooks.insertModule(module, 0);
    XT.session.addRelevantPrivileges(XT.extensions.billing.name, relevantPrivileges);
  };

}());
