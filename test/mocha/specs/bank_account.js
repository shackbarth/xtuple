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
    assert = require("chai").assert,
    model;

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

      describe('test filtering on picker', function () {
        var K, picker, nullModel, billingModel, notBillingModel;

        before(function () {
          assert.isDefined(XV.BillingBankAccountPicker);
          picker = new XV.BillingBankAccountPicker();

          // add some mock data
          assert.isDefined(XM.BankAccountRelation);
          K = XM.BankAccountRelation;
          nullModel = new XM.BankAccountRelation({id: "1", name: "test1"});
          billingModel = new XM.BankAccountRelation({id: "2", name: "test2", isUsedByBilling: true});
          notBillingModel = new XM.BankAccountRelation({id: "3", name: "test3", isUsedByBilling: false});
          XM.bankAccountRelations.add(nullModel);
          XM.bankAccountRelations.add(billingModel);
          XM.bankAccountRelations.add(notBillingModel);
        });

        it('verify that the list has the billing model only', function () {
          picker.buildList();
          var list = picker.getListModels();
          assert.isTrue(_.contains(list, billingModel), 'The list should contain this model');
          assert.isFalse(_.contains(list, notBillingModel), 'The list should not contain this model');
          assert.isFalse(_.contains(list, nullModel), 'The list should not contain this model');
        });
      });
    });
  };

  exports.additionalTests = additionalTests;
}());
