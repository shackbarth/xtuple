/*jshint maxlen: false */

/*
  TODO: move the tests out of this file into the specs files themselves.
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
    skipCrud: true,
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
    additionalTests: require("../specs/cash_receipt").additionalTests,
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
