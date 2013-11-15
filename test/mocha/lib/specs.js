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
      'customer', 'amount', 'currency', 'currencyRate', 'bankAccount', 'applicationDate', 'isPosted'
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

}());
