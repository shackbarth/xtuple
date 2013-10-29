/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true */


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
    attributes: ["name", "description", "bankName", "accountNumber", "bankAccountType", "isUsedByBilling",
      "isUsedByPayments", "notes", "currency"],
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
  */
  exports.invoice = {
    skipSmoke: true, // XXX
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
    attributes: ["number"], // TODO
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
      number: "33InvoiceTest" + Math.random(),
      customer: {number: "TTOYS"}
    },
    updatableField: "notes",
    additionalTests: require("../specs/invoice").additionalTests
  };

  /**
   @lends invoice
    Some invoice stuff
   */
  var invoiceDetail = "foo";

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
      "taxTotal", "commission"],
    // TODO: "applications"],
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
    // afterSaveActions: [{
    //   it: "When the status of a receivable changes to READY_CLEAN (edit), the following attributes: " +
    //   "customer, documentDate, documentType, documentNumber, terms should be readOnly",
    //   action: function (data, next) {
    //     assert.include(data.model.readOnlyAttributes, "customer");
    //     assert.include(data.model.readOnlyAttributes, "documentDate");
    //     assert.include(data.model.readOnlyAttributes, "documentType");
    //     assert.include(data.model.readOnlyAttributes, "documentNumber");
    //     assert.include(data.model.readOnlyAttributes, "terms");
    //     next();
    //   }
    // }],
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
