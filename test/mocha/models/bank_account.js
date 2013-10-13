/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var crud = require("../lib/crud"),
    assert = require("chai").assert,
    _ = require("underscore"),
    data = {
      recordType: "XM.BankAccount",
      autoTestAttributes: true,
      createHash: {
        name: "BankAccount" + Math.random(),
        description: "Description of bank account",
        bankName: "Bank Name",
        accountNumber: Math.random(),
        bankAccountType: "C"
      },
      updateHash: {
        description: "New Description"
      },
      beforeSetActions: [{
        it: "verify setup of model",
        action: function (data, next) {
          // takes care of the corner cases not covered by the test runner spec
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
      afterSaveActions: [
        {
          it: "verify default values are saved",
          action: function (data, next) {
            assert.equal(data.model.get("currency"), XT.baseCurrency());
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
        }
      ],
    };

  describe('Reason Code CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
