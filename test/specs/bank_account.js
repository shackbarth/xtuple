/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;

  var spec = {
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
    }]
  };

  var additionalTests = function () {
    it('verify constant values', function () {
      assert.equal(XM.BankAccount.CASH, "C");
      assert.equal(XM.BankAccount.CHECKING, "K");
      assert.equal(XM.BankAccount.CREDIT_CARD, "R");
    });

    it('verify that XM.bankAccountTypes contains the constants', function () {
      assert.equal(XM.bankAccountTypes.length, 3);

      var ids = _.pluck(XM.bankAccountTypes.models, "id");
      assert.include(ids, XM.BankAccount.CASH);
      assert.include(ids, XM.BankAccount.CHECKING);
      assert.include(ids, XM.BankAccount.CREDIT_CARD);
    });

    it('verify that Billing Bank Account Picker only lists bank accounts where isUsedByBilling is true',
      function () {

      assert.isDefined(XV.BillingTermsPicker);
      var picker = new XV.BillingBankAccountPicker();
      _.each(picker.filteredList(), function (model) {
        assert.isTrue(model.get("isUsedByBilling"));
      });

    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;


}());
