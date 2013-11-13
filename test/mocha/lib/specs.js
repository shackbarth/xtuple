/*jshint maxlen: false */

/*
  TODO: move the tests out of this file into the specs files themselves.
*/

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    assert = require("chai").assert;


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


}());
