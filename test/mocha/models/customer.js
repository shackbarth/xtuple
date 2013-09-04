/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    assert = require("chai").assert,
    data = {
      recordType: "XM.Customer",
      autoTestAttributes: true,
      createHash : {
        number: "TESTCUSTOMER" + Math.random(),
        name: "TestCust",
        customerType: { code: "NORMAL" },
        salesRep: { number: "JSMITH" },
        shipCharge: { name: "ADDCHARGE" },
        terms: { code: "2-10N30" }
      },
      updateHash : {
        name: "Updated Test Cust"
      },
      beforeSaveActions: [{
        it: "should add a credit card",
        action: function (data, next) {
          var creditCardModel = new XM.CreditCard(),
            creditCardHash = {
              creditCardType: "V",
              name: "John Smith",
              address1: "123 Main Street",
              city: "Norfolk",
              state: "VA",
              zip: "23510",
              country: "USA",
              monthExpired: "05",
              yearExpired: "2010",
              number: "4111111111111111",
              sequence: 500
            },
            setCreditCard = function () {
              creditCardModel.off("change:id", setCreditCard);
              creditCardModel.set(creditCardHash);
              data.model.get("creditCards").add(creditCardModel);
              next();
            };

          creditCardModel.on("change:uuid", setCreditCard);
          creditCardModel.initialize(null, {isNew: true});
        }
      }],
      afterSaveActions: [{
        it: "should have saved the credit card correctly",
        action: function (data, next) {
          assert.equal(data.model.get("creditCards").models[0].get("number"), "************1111");
          next();
        }
      }],
      beforeDeleteActions: crud.accountBeforeDeleteActions,
      afterDeleteActions: crud.accountAfterDeleteActions
    };

  describe('Customer CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
