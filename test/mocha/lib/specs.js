/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
  assert = require("chai").assert;

  exports.honorific = {
    recordType: "XM.Honorific",
    collectionType: "XM.HonorificCollection",
    cacheName: "XM.honorifics",
    listKind: "XV.HonorificList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code"],
    extensions: ["crm", "project"],
    privileges: {
      createUpdateDelete: "MaintainTitles",
      read: true
    },
    createHash: {
      code: "Herr" + Math.random()
    },
    updatableField: "code"
  };

  exports.item = {
    recordType: "XM.Item",
    collectionType: "XM.ItemListItemCollection",
    cacheName: null,
    listKind: "XV.ItemList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "description1"], // TODO: more
    extensions: ["crm", "sales", "inventory", "project"], // TODO: billing
    privileges: {
      createUpdate: "MaintainItemMasters",
      read: "ViewItemMasters",
      delete: "DeleteItemMasters"
    },
    createHash: {
      number: "ATEST" + Math.random(),
      description1: "Item description1",
      isActive: true,
      itemType: "P",
      classCode: {code: "TOYS-COMP"},
      productCategory: {code: "CLASSIC-WOOD"},
      inventoryUnit: {name: "CS"},
      isFractional: true,
      isSold: true,
      listPrice: 0.00,
      priceUnit: {name: "CS"}
    },
    updatableField: "description1"
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
    extensions: ["sales", "inventory"],
    //extensions: ["sales", "inventory", "billing"],
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
    extensions: ["inventory"], // TODO billing
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
    beforeSetActions: [{
      it: "verify setup of model",
      action: function (data, next) {
        it('verify constant values', function () {
          assert.equal(XM.ReasonCode.CREDIT_MEMO, "ARCM");
          assert.equal(XM.ReasonCode.DEBIT_MEMO, "ARDM");
        });

        it('verify that XM.reasonCodeDocumentTypes contains the constants', function () {
          assert.equal(XM.reasonCodeDocumentTypes.length, 2);

          assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
            return m.id === XM.ReasonCode.CREDIT_MEMO;
          }));
          assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
            return m.id === XM.ReasonCode.DEBIT_MEMO;
          }));
        });

        next();
      }
    }],
    afterSaveActions: [{
      it: "verify saved reason code is in cached collection",
      action: function (data, next) {
        assert.isTrue(_.contains(XM.reasonCodes.models, data.model));
        next();
      }
    }],
  };

  exports.bankAccount = {
    recordType: "XM.BankAccount",
    collectionType: "XM.BankAccountCollection",
    cacheName: "XM.bankAccounts",
    listKind: "XV.BankAccountList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "name",
    enforceUpperKey: false,
    attributes: ["name", "description", "bankName", "accountNumber", "bankAccountType", "isUsedByBilling",
      "isUsedByPayments", "notes", "currency"],
    extensions: ["sales"],
    //extensions: ["sales", "billing"],
    privileges: {
      createUpdateDelete: "MaintainBankAccounts",
      read: "ViewBankAccounts"
    },
    createHash: {
      name: "TestBankAccount" + Math.random(),
      description: "Test bank account",
      bankName: "TestBankName",
      accountNumber: Math.random(),
      notes: "Test bank account notes"
    },
    updatableField: "description",
    beforeSetActions: [{
      // TODO: handle better with test runner
      it: "verify setup of model",
      action: function (data, next) {
        it('verify constant values', function () {
          assert.equal(XM.BankAccount.CASH, "C");
          assert.equal(XM.BankAccount.CHECKING, "K");
          assert.equal(XM.BankAccount.CREDIT_CARD, "R");
        });

        it('verify that XM.reasonCodeDocumentTypes contains the constants', function () {
          assert.equal(XM.bankAccountTypes.length, 3);

          assert.ok(_.find(XM.bankAccountTypes.models, function (m) {
            return m.id === XM.BankAccount.CASH;
          }));
          assert.ok(_.find(XM.bankAccountTypes.models, function (m) {
            return m.id === XM.BankAccount.CHECKING;
          }));
          assert.ok(_.find(XM.bankAccountTypes.models, function (m) {
            return m.id === XM.BankAccount.CREDIT_CARD;
          }));
        });

        next();
      }
    }],
    afterSaveActions: [{
      // TODO: this could probably be handled in test runner
      it: "verify default values are saved",
      action: function (data, next) {
        assert.equal(data.model.get("currency").id, XT.baseCurrency().id);
        assert.equal(data.model.get("isUsedByBilling"), false);
        assert.equal(data.model.get("isUsedByPayments"), false);
        next();
      }
    },
    {
      it: "verify saved bankAccount is in cached collection",
      action: function (data, next) {
        assert.isTrue(_.contains(XM.bankAccounts.models, data.model));
        next();
      }
    },
    {
      it: "verify currency is readonly",
      action: function (data, next) {
        assert.isTrue(_.contains(data.model.readOnlyAttributes, "currency"));
        next();
      }
    }]
  };

  // TODO: Add support for relations to test runner
  // exports.bankAccountRelations = {
  //   recordType: "XM.BankAccountRelation",
  //   collectionType: "XM.BankAccountRelationCollection",
  //   cacheName: "XM.bankAccountRelations",
  //   instanceOf: "XM.Info",
  //   idAttribute: "name",
  //   listKind: "XV.BankAccountList",
  //   attributes: ["name", "description", "isUsedByBilling", "isUsedByPayments", "currency"],
  //   extensions: ["sales", "billing"],
  //   privileges: {
  //     createUpdateDelete: false,
  //     read: true
  //   }
  // };
}());
