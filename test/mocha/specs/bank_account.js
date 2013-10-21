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

  var additionalTests = function () {
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

    it('verify that Billing Bank Account Picker only lists bank accounts where isUsedByBilling is true',
      function () {

      assert.isDefined(XV.BillingTermsPicker);
      var picker = new XV.BillingBankAccountPicker();
      _.each(picker._collection.models, function (model) {
        assert.isTrue(model.get("isUsedByBilling"));
      });

    });
  };

  exports.additionalTests = additionalTests;
}());
