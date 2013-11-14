/*jshint maxlen: false */
/*
  To generate spec documentation:
  cd scripts
  ./generateSpecs.sh
*/

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    assert = require("chai").assert;

  exports.bankAccount = {
    recordType: "XM.BankAccount",
    collectionType: "XM.BankAccountCollection",
    cacheName: null, // there is no cache for BankAccount
    listKind: "XV.BankAccountList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "name",
    enforceUpperKey: false,
    attributes: ["name", "description", "bankName", "accountNumber", "bankAccountType",
      "isUsedByBilling", "isUsedByPayments", "notes", "currency"],
    extensions: ["sales", "billing"],
    privileges: {
      createUpdateDelete: "MaintainBankAccounts",
      read: "MaintainBankAccounts"
    },
    createHash: {
      name: "TestBankAccount" + Math.random(),
      description: "Test bank account",
      bankName: "TestBankName",
      accountNumber: Math.random(),
      notes: "Test bank account notes"
    },
    updatableField: "description",
    defaults: {
      //currency: XT.baseCurrency(),
      isUsedByBilling: false,
      isUsedByPayments: false
    },
    afterSaveActions: [{
      it: "verify currency is readonly",
      action: function (data, next) {
        assert.include(data.model.readOnlyAttributes, "currency");
        next();
      }
    }],
    additionalTests: require("../specs/bank_account").additionalTests
  };

  exports.configureBilling = {
    recordType: "XM.Billing",
    skipCrud: true,
    skipSmoke: true,
    skipModelConfig: true,
    privileges: {
      read: "ConfigureAR",
      createUpdate: "ConfigureAR",
      delete: false
    },
    additionalTests: require("../specs/configure_billing").additionalTests
  };

  exports.cashReceipt = {
    recordType: 'XM.CashReceipt',
    collectionType: 'XM.CashReceiptCollection',
    cacheName: null,
    skipSmoke: true,
    //skipCrud: true,
    instanceOf: 'XM.Document',
    isLockable: true,
    idAttribute: 'number',
    enforceUpperKey: false,
    attributes: [
      'number', 'customer', 'amount', 'currency', 'currencyRate',
      'documentNumber', 'documentDate', 'bankAccount', 'distributionDate',
      'applicationDate', 'notes', 'isPosted', 'lineItems', 'balance'
    ],
    requiredAttributes: [
      'customer', 'amount', 'currency', 'currencyRate', 'bankAccount',
      'applicationDate', 'isPosted'
    ],
    defaults: {
      isPosted: false
    },
    privileges: {
      create: 'MaintainCashReceipts',
      read: true,
      update: 'MaintainCashReceipts',
      delete: 'MaintainCashReceipts'
    },
    extensions: ["billing"],
    //updatableField: 'notes',
    listKind: 'XV.CashReceiptList',
    createHash: {

    },
    //additionalTests: require("../specs/cash_receipt").additionalTests,
  };

  exports.currency = {
    name: 'currency',
    recordType: 'XM.Currency',
    collectionType: 'XM.CurrencyCollection',
    cacheName: 'XM.currencies',
    instanceOf: 'XM.Document',
    isLockable: true,
    idAttribute: 'abbreviation',
    enforceUpperKey: false,
    attributes: [
      'name', 'symbol', 'abbreviation'
    ],
    defaults: {
      isBase: false
    },
    privileges: {
      create: 'CreateNewCurrency',
      read: true,
      update: 'MaintainCurrencies',
      delete: 'MaintainCurrencies'
    },
    extensions: ["billing"],
    createHash: {
      name: 'name' + Math.random().toString(36).slice(0, 3),
      symbol: Math.random().toString(36).slice(0, 3),
      abbreviation: Math.random().toString(36).slice(0, 3)
    },
    updatableField: 'name',
    listKind: 'XV.CurrencyList'
  };

  /**
    A title, such as Mr. or Mrs.
    @class
    @alias Honorific
  */
  exports.honorific = {
    recordType: "XM.Honorific",
    collectionType: "XM.HonorificCollection",
    /**
      @member -
      @memberof Honorific.prototype
      @description The honorific collection is cached.
    */
    cacheName: "XM.honorifics",
    listKind: "XV.HonorificList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Honorific.prototype
      @description Honorifics are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Honorific.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Used in the crm and project modules
    */
    extensions: ["crm", "project"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Honorifics can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainTitles" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTitles",
      read: true
    },
    createHash: {
      code: "Herr" + Math.random()
    },
    updatableField: "code"
  };

  /**
    Here is some high-level description of what an invoice is supposed to do.
    @class
    @alias Invoice
    @parameter {String} number that is the documentKey and idAttribute
    @parameter {Date} invoiceDate required default today
    @parameter {Boolean} isPosted required, defaulting to false, read only
    @parameter {Boolean} isVoid required, defaulting to false, read only
    @parameter {BillingCustomer} customer required
    @parameter {String} billtoName
    @parameter {String} billtoAddress1
    @parameter {String} billtoAddress2
    @parameter {String} billtoAddress3
    @parameter {String} billtoCity
    @parameter {String} billtoState
    @parameter {String} billtoPostalCode
    @parameter {String} billtoCountry
    @parameter {String} billtoPhone
    @parameter {Currency} currency
    @parameter {Terms} terms
    @parameter {SalesRep} salesRep
    @parameter {Percent} commission required, default 0
    @parameter {SaleType} saleType
    @parameter {String} customerPurchaseOrderNumber
    @parameter {TaxZone} taxZone
    @parameter {String} notes
    @parameter {InvoiceRelation} recurringInvoice
    @parameter {Money} allocatedCredit the sum of all allocated credits
    @parameter {Money} outandingCredit the sum of all unallocated credits, not including
      cash receipts pending
    @parameter {Money} subtotal the sum of the extended price of all line items
    @parameter {Money} taxTotal the sum of all taxes inluding line items, freight and
      tax adjustments
    @parameter {Money} miscCharge read only (will be re-implemented as editable by Ledger)
    @parameter {Money} total the calculated total of subtotal + freight + tax + miscCharge
    @parameter {Money} balance the sum of total - allocatedCredit - authorizedCredit -
      outstandingCredit.
      - If sum calculates to less than zero, then the balance is zero.
    @parameter {InvoiceAllocation} allocations
    @parameter {InvoiceTax} taxAdjustments
    @parameter {InvoiceLine} lineItems
    @parameter {InvoiceCharacteristic} characteristics
    @parameter {InvoiceContact} contacts
    @parameter {InvoiceAccount} accounts
    @parameter {InvoiceCustomer} customers
    @parameter {InvoiceFile} files
    @parameter {InvoiceUrl} urls
    @parameter {InvoiceItem} items
    @parameter {String} orderNumber Added by sales extension
    @parameter {Date} orderDate Added by sales extension
    @parameter {InvoiceSalesOrder} salesOrders Added by sales extension
    @parameter {InvoiceIncident} incidents Added by crm extension
    @parameter {InvoiceOpportunity} opportunities Added by crm extension
  */
  exports.invoice = {
    recordType: "XM.Invoice",
    collectionType: "XM.InvoiceListItemCollection",
    /**
      @member -
      @memberof Invoice.prototype
      @description The invoice collection is not cached.
    */
    cacheName: null,
    listKind: "XV.InvoiceList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Invoice.prototype
      @description Invoice is lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Invoice.prototype
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "invoiceDate", "isPosted", "isVoid", "customer",
      "billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3",
      "billtoCity", "billtoState", "billtoPostalCode", "billtoCountry",
      "billtoPhone", "currency", "terms", "salesRep", "commission",
      "saleType", "customerPurchaseOrderNumber", "taxZone", "notes",
      "recurringInvoice", "allocatedCredit", "outstandingCredit", "subtotal",
      "taxTotal", "miscCharge", "total", "balance", "allocations",
      "taxAdjustments", "lineItems", "characteristics", "contacts",
      "accounts", "customers", "files", "urls", "items",
      "orderNumber", "orderDate", "salesOrders", // these 3 from sales extension
      "incidents", "opportunities", // these 2 from crm
      "project", "projects"], // these 2 from project
    requiredAttributes: ["number", "invoiceDate", "isPosted", "isVoid",
      "customer", "commission"],
    defaults: {
      invoiceDate: new Date(),
      isPosted: false,
      isVoid: false,
      commission: 0
    },
    /**
      @member -
      @memberof Invoice.prototype
      @description Used in the billing module
    */
    extensions: ["billing"],
    /**
      @member -
      @memberof Invoice.prototype
      @description Users can create, update, and delete invoices if they have the
        MaintainMiscInvoices privilege, and they can read invoices if they have
        the ViewMiscInvoices privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainMiscInvoices",
      read: "ViewMiscInvoices"
    },
    createHash: {
      number: "30" + (100 + Math.round(Math.random() * 900)),
      customer: {number: "TTOYS"}
    },
    updatableField: "notes",
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: require("./model_data").getBeforeSaveAction("XM.InvoiceLine")}],
    skipSmoke: true,
    beforeSaveUIActions: [{it: 'sets up a valid line item',
      action: function (workspace, done) {
        var gridRow;

        workspace.value.on("change:total", done);
        workspace.$.invoiceLineItemBox.newItem();
        gridRow = workspace.$.invoiceLineItemBox.$.editableGridRow;
        // TODO
        //gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
          //site: submodels.siteModel}});
        gridRow.$.quantityWidget.doValueChange({value: 5});

      }
    }],
    additionalTests: require("../specs/invoice").additionalTests
  };

  // exports.item = {
  //   recordType: "XM.Item",
  //   collectionType: "XM.ItemListItemCollection",
  //   cacheName: null,
  //   listKind: "XV.ItemList",
  //   instanceOf: "XM.Document",
  //   isLockable: true,
  //   idAttribute: "number",
  //   enforceUpperKey: true,
  //   attributes: ["number", "description1"], // TODO: more
  //   extensions: ["billing", "crm", "sales", "inventory", "project"],
  //   privileges: {
  //     createUpdate: "MaintainItemMasters",
  //     read: "ViewItemMasters",
  //     delete: "DeleteItemMasters"
  //   },
  //   createHash: {
  //     number: "ATEST" + Math.random(),
  //     description1: "Item description1",
  //     isActive: true,
  //     itemType: "P",
  //     classCode: {code: "TOYS-COMP"},
  //     productCategory: {code: "CLASSIC-WOOD"},
  //     inventoryUnit: {name: "CS"},
  //     isFractional: true,
  //     isSold: true,
  //     listPrice: 0.00,
  //     priceUnit: {name: "CS"}
  //   },
  //   updatableField: "description1"
  // };

  exports.reasonCode = {
    recordType: "XM.ReasonCode",
    collectionType: "XM.ReasonCodeCollection",
    cacheName: "XM.reasonCodes",
    listKind: "XV.ReasonCodeList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description", "documentType"],
    extensions: ["inventory", "billing"],
    privileges: {
      createUpdateDelete: "MaintainReasonCodes",
      read: true
    },
    createHash: {
      code: "TestReasonCode" + Math.random(),
      description: "Test Reason Code",
      documentType: "ARDM"
    },
    updatableField: "description",
    additionalTests: require("../specs/reason_code").additionalTests,
    afterSaveActions: [{
      it: "verify saved reason code is in cached collection",
      action: function (data, next) {
        assert.isTrue(_.contains(XM.reasonCodes.models, data.model));
        next();
      }
    }],
  };

  exports.receivable = {
    recordType: "XM.Receivable",
    skipSmoke: true,
    skipSave: true,
    skipDelete: true,
    skipUpdate: true,
    listKind: "XV.ReceivableListItem",
    collectionType: null,
    cacheName: null,
    enforceUpperKey: true,
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "uuid",
    documentKey: "documentNumber",
    attributes: ["uuid", "documentDate", "customer", "dueDate",
      "terms", "salesRep", "documentType", "documentNumber", "orderNumber",
      "reasonCode", "amount", "currency", "paid", "notes", "taxes", "balance",
      "taxTotal", "commission", "applications"],
    requiredAttributes: ["currency", "customer", "documentDate", "dueDate", "amount"],
    extensions: ["billing"],
    privileges: {
      createUpdateDelete: "EditAROpenItem",
      read: "ViewAROpenItems"
    },
    createHash: {
      uuid: "TestReceivableId" + Math.random(),
      customer: {number: "TTOYS"},
      documentDate: new Date(),
      dueDate: new Date(),
      amount: 100,
      currency: {abbreviation: "USD"},
      documentNumber: "DocumentNumber" + Math.random()
    },
    updatableField: "notes",
    additionalTests: require("../specs/receivable").additionalTests
  };

  exports.shipVia = {
    recordType: "XM.ShipVia",
    collectionType: "XM.ShipViaCollection",
    cacheName: "XM.shipVias",
    listKind: "XV.ShipViaList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description"],
    extensions: ["billing", "inventory", "sales"],
    privileges: {
      createUpdateDelete: "MaintainShipVias",
      read: true
    },
    createHash: {
      code: "TestShipVia" + Math.random(),
      description: "Test Ship Via"
    },
    updatableField: "description"
  };

  exports.terms = {
    recordType: "XM.Terms",
    collectionType: "XM.TermsCollection",
    cacheName: "XM.terms",
    listKind: "XV.TermsList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "cutOffDay", "description", "dueDays", "discountDays", "discountPercent",
      "isUsedByBilling", "isUsedByPayments", "termsType"],
    defaults: {
      dueDays: 0,
      discountDays: 0,
      cutOffDay: 0,
      isUsedByBilling: false,
      isUsedByPayments: false,
      termsType: "D"
    },
    extensions: ["billing", "inventory", "sales"],
    privileges: {
      createUpdateDelete: "MaintainTerms",
      read: true
    },
    createHash: {
      code: "TestTerms" + Math.random(),
      description: "Test Terms"
    },
    updatableField: "description",
    additionalTests: require("../specs/terms").additionalTests
  };

}());
